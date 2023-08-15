/*
 * 回帖的 CRUD，定义了一些对回帖数据的数据库交互操作
 */
import ReplyModel from '@/models/replyModel'
import TagService from './tagService'
import PostModel from '@/models/postModel'

class ReplyService {
  // 创建回帖
  async createReply(pid, r_uid, to_uid, tags, content) {
    // 获取楼层数，以楼主帖子的一楼为基准
    const maxFloorReply = await ReplyModel.findOne({ pid })
      .sort('-floor')
      .lean()
    const baseFloor = maxFloorReply ? maxFloorReply.floor : 0
    const floor = baseFloor + 1

    // 统计标签出现次数
    const tagCounts = {}
    for (const tag of tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    }

    const newReply = new ReplyModel({
      pid,
      r_uid,
      to_uid,
      floor,
      tags,
      content,
    })

    const savedReply = await newReply.save()

    // 更新标签的出现次数
    for (const tag in tagCounts) {
      await TagService.updateTagCount(tag, tagCounts[tag])
    }

    // 更新帖子的 rid 数组
    await PostModel.updateOne({ pid }, { $push: { rid: savedReply.rid } })

    return savedReply
  }

  // 获取单个回帖详情
  async getReplyByRid(rid) {
    const reply = await ReplyModel.findOne({ rid }).lean()
    return reply
  }

  // 更新回帖
  async updateReply(rid, content) {
    const updatedReply = await ReplyModel.findOneAndUpdate(
      { rid },
      { $set: { content, edited: new Date().toISOString() } },
      { new: true }
    ).lean()
    return updatedReply
  }

  // 删除回帖
  async deleteReply(rid) {
    const deletedReply = await ReplyModel.findOneAndDelete({ rid }).lean()

    // 删除回帖的时候也要把帖子 rid 数组里对应的 pid 删除
    if (deletedReply) {
      const post = await PostModel.findOne({ pid: deletedReply.pid })
      if (post) {
        const updatedRids = post.rid.filter((r) => r !== rid)
        post.rid = updatedRids
        await post.save()
      }
    }

    return deletedReply
  }

  // 获取回帖的接口
  async getReplies(pid, page, limit, sortField, sortOrder) {
    const post = await PostModel.findOne({ pid }).lean()
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
      pid: reply.pid,
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
