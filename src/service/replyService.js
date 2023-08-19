/*
 * 回复的 CRUD，定义了一些对回复数据的数据库交互操作
 */
import ReplyModel from '@/models/replyModel'
import PostModel from '@/models/topicModel'
import TagService from './tagService'
import UserService from './userService'

class ReplyService {
  // 创建回复
  async createReply(tid, r_uid, to_uid, tags, content) {
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
      floor,
      tags,
      content,
    })

    const savedReply = await newReply.save()

    // 在用户的回复数组里保存回复
    await UserService.updateUserArray(r_uid, 'reply', savedReply.rid)

    // 更新话题的 rid 数组
    await PostModel.updateOne({ tid }, { $push: { rid: savedReply.rid } })

    // 保存 tags
    await TagService.createTagsByTidAndRid(tid, savedReply.rid, tags, '')

    return savedReply
  }

  // 获取单个回复详情，暂时用不到
  // async getReplyByRid(rid) {
  //   const reply = await ReplyModel.findOne({ rid }).lean()
  //   return reply
  // }

  // 更新回复
  async updateReply(tid, rid, content, tags) {
    const updatedReply = await ReplyModel.findOneAndUpdate(
      { rid },
      { $set: { content, edited: new Date().toISOString(), tags } },
      { new: true }
    ).lean()

    // 保存 tags
    await TagService.updateTagsByTidAndRid(tid, rid, tags, '')
    return updatedReply
  }

  // 向回复 model 中的评论数组增添一条评论
  async addCommentToReply(rid, cid) {
    await ReplyModel.updateOne({ rid }, { $addToSet: { cid } })
  }

  // 从回复 model 中的评论数组移除一条评论
  async removeCommentFromReply(rid, cid) {
    await ReplyModel.updateOne({ rid }, { $pull: { cid } })
  }

  // 删除回复
  async deleteReply(rid) {
    const deletedReply = await ReplyModel.findOneAndDelete({ rid }).lean()

    // 删除回复的时候也要把话题 rid 数组里对应的 tid 删除
    if (deletedReply) {
      const post = await PostModel.findOne({ tid: deletedReply.tid })
      if (post) {
        const updatedRids = post.rid.filter((r) => r !== rid)
        post.rid = updatedRids
        await post.save()
      }
    }

    return deletedReply
  }

  // 获取某个话题下回复的接口，分页获取，懒加载，每次 5 条
  async getReplies(tid, page, limit, sortField, sortOrder) {
    const post = await PostModel.findOne({ tid }).lean()
    const totalReplies = post.rid.length

    const startIndex = (page - 1) * limit
    const endIndex = Math.min(startIndex + limit, totalReplies)

    const replies = post.rid.slice(startIndex, endIndex)

    const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 }

    const replyDetails = await ReplyModel.find({ rid: { $in: replies } })
      .sort(sortOptions)
      .lean()

    const responseData = replyDetails.map((reply) => ({
      rid: reply.rid,
      tid: reply.tid,
      r_uid: reply.r_uid,
      to_uid: reply.to_uid,
      edited: reply.edited,
      content: reply.content,
      upvote: reply.upvote,
      likes: reply.likes,
      dislikes: reply.dislikes,
      tags: reply.tags,
      cid: reply.cid,
    }))

    return responseData
  }
}

export default new ReplyService()
