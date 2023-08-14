import ReplyModel from '@/models/replyModel'
import TagService from './tagService'

class ReplyService {
  // 创建回帖
  async createReply(pid, r_uid, to_uid, tags, content) {
    try {
      // 获取楼层数，以楼主帖子的一楼为基准
      const baseFloor = await ReplyModel.countDocuments({ pid, floor: 1 })
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
        // 手动指定虚拟字段的值
        user: r_uid,
        post: pid,
      })

      console.log(newReply)

      const savedReply = await newReply.save()

      // 更新标签的出现次数
      for (const tag in tagCounts) {
        await TagService.updateTagCount(tag, tagCounts[tag])
      }

      return savedReply
    } catch (error) {
      throw new Error('Failed to create reply')
    }
  }

  // 获取单个回帖详情
  async getReplyByRid(rid) {
    try {
      const reply = await ReplyModel.findOne({ rid }).lean()
      return reply
    } catch (error) {
      throw new Error('Failed to fetch reply')
    }
  }

  // 更新回帖
  async updateReply(rid, content) {
    try {
      const updatedReply = await ReplyModel.findOneAndUpdate(
        { rid },
        { $set: { content, edited: new Date().toISOString() } },
        { new: true }
      ).lean()
      return updatedReply
    } catch (error) {
      throw new Error('Failed to update reply')
    }
  }

  // 删除回帖
  async deleteReply(rid) {
    try {
      const deletedReply = await ReplyModel.findOneAndDelete({ rid }).lean()
      return deletedReply
    } catch (error) {
      throw new Error('Failed to delete reply')
    }
  }

  // 获取评论的接口
  async getReplies(pid, page, limit) {
    const post = await PostModel.findOne({ pid }).lean()
    const totalReplies = post.rid.length

    const startIndex = (page - 1) * limit
    const endIndex = Math.min(startIndex + limit, totalReplies)

    const replies = post.rid.slice(startIndex, endIndex)

    const replyDetails = await ReplyModel.find({ rid: { $in: replies } }).lean()

    const responseData = replyDetails.map(
      reply({
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
      })
    )

    return { responseData, totalReplies }
  }
}

export default new ReplyService()
