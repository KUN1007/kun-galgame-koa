// commentService.js
import CommentModel from '@/models/commentModel'

class CommentService {
  static async getCommentsByReplyIds(replyIds, page, limit) {
    try {
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit

      const comments = await CommentModel.find({ rid: { $in: replyIds } })
        .sort({ time: -1 }) // 按时间倒序排序
        .skip(startIndex)
        .limit(limit)
        .lean()

      return comments
    } catch (error) {
      throw new Error('Failed to fetch comments')
    }
  }

  // 其他评论相关的方法...
}

export default CommentService
