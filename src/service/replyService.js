import ReplyModel from '@/models/replyModel'

class ReplyService {
  // 获取评论的接口
  async getReplies(pid, page, limit) {
    const post = await PostModel.findOne({ pid }).lean()
    const totalReplies = post.rid.length

    const startIndex = (page - 1) * limit
    const endIndex = Math.min(startIndex + limit, totalReplies)

    const replies = post.rid.slice(startIndex, endIndex)

    const replyDetails = await ReplyModel.find({ rid: { $in: replies } }).lean()

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

    return { responseData, totalReplies }
  }
}

export default new ReplyService()
