/*
 * 回复的 CRUD，定义了一些对回复数据的数据库交互操作
 */
import ReplyModel from '@/models/replyModel'
import TopicModel from '@/models/topicModel'
import TopicService from './topicService'
import TagService from './tagService'
import UserService from './userService'
import mongoose from '@/db/connection'

// 回复可供更新的字段名
type UpdateField = 'upvotes' | 'likes' | 'dislikes' | 'share' | 'cid'

class ReplyService {
  // 创建回复
  async createReply(
    tid: number,
    r_uid: number,
    to_uid: number,
    to_floor: number,
    tags: string[],
    content: string
  ) {
    // 启动事务
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // 获取楼层数，以楼主话题的一楼为基准
      const maxFloorReply = await ReplyModel.findOne({ tid })
        .sort('-floor')
        .lean()
      const baseFloor = maxFloorReply ? maxFloorReply.floor : 0
      const floor = baseFloor + 1

      const newReply = new ReplyModel({
        tid,
        r_uid,
        to_uid,
        to_floor,
        floor,
        tags: tags,
        content,
      })

      const savedReply = await newReply.save()

      // 在用户的回复数组里保存回复，这里只是保存，没有撤销操作，所以是 true
      await UserService.updateUserArray(r_uid, 'reply', savedReply.rid, true)

      // 更新被回复用户的萌萌点
      await UserService.updateUserNumber(to_uid, 'moemoepoint', 2)

      // 更新话题的 rid 数组
      await TopicModel.updateOne({ tid }, { $push: { rid: savedReply.rid } })

      // 话题的热度增加 5 点
      await TopicService.updateTopicPop(tid, 5)

      // 保存 tags
      await TagService.createTagsByTidAndRid(tid, savedReply.rid, tags, [])

      return savedReply
    } catch (error) {
      // 如果出现错误，回滚事务
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }

  // 更新回复
  async updateReply(tid: number, rid: number, content: string, tags: string[]) {
    // 启动事务
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const updatedReply = await ReplyModel.findOneAndUpdate(
        { rid },
        { $set: { content, edited: Date.now(), tags } },
        { new: true }
      ).lean()

      // 保存 tags
      await TagService.updateTagsByTidAndRid(tid, rid, tags, [])
      return updatedReply
    } catch (error) {
      // 如果出现错误，回滚事务
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }

  // 获取某个话题下回复的接口，分页获取，懒加载，每次 5 条
  /**
   * @param {number} tid - 话题的 id，在那个话题中获取回复
   * @param {number} page - 分页的页数，第几页
   * @param {number} limit - 分页中每页有多少条信息
   * @param {string} sortField - 根据哪个字段进行排序
   * @param {string} sortOrder - 升序还是降序，`asc`, `desc`
   */
  async getReplies(
    tid: number,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: 'asc' | 'desc'
  ) {
    // 启动事务
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const replyId = (await TopicModel.findOne({ tid }).lean()).rid

      const skip = (page - 1) * limit

      const sortOptions: Record<string, 'asc' | 'desc'> = {
        [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
      }

      const replyDetails = await ReplyModel.find({ rid: { $in: replyId } })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('r_user', 'uid avatar name moemoepoint')
        .populate('to_user', 'uid name')
        .lean()

      const responseData = replyDetails.map((reply) => ({
        rid: reply.rid,
        tid: reply.tid,
        floor: reply.floor,
        to_floor: reply.to_floor,
        r_user: {
          uid: reply.r_user[0].uid,
          name: reply.r_user[0].name,
          avatar: reply.r_user[0].avatar,
          moemoepoint: reply.r_user[0].moemoepoint,
        },
        to_user: {
          uid: reply.to_user[0].uid,
          name: reply.to_user[0].name,
        },
        edited: reply.edited,
        content: reply.content,
        upvotes: reply.upvotes,
        likes: reply.likes,
        dislikes: reply.dislikes,
        tags: reply.tags,
        time: reply.time,
        cid: reply.cid,
      }))

      return responseData
    } catch (error) {
      // 如果出现错误，回滚事务
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }

  // 更新回复数组，用于推，点赞，点踩，分享等
  /**
   * @param {number} rid - 回复 id
   * @param {UpdateField} updateField - 要更新回复 Model 的哪个字段
   * @param {number} uid - uid
   * @param {boolean} isPush - 移除还是 push，用于撤销点赞等操作
   */
  async updateReplyArray(
    rid: number,
    updateField: UpdateField,
    uid: number,
    isPush: boolean
  ) {
    // 取消则 pull
    if (isPush) {
      await ReplyModel.updateOne(
        { rid: rid },
        { $addToSet: { [updateField]: uid } }
      )
      // 不取消则 push
    } else {
      await ReplyModel.updateOne(
        { rid: rid },
        { $pull: { [updateField]: uid } }
      )
    }
  }
}

export default new ReplyService()
