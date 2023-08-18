import CommentService from '@/service/commentService'

class CommentController {
  // 发布单条评论
  async createComment(ctx) {
    try {
      const pid = ctx.params.pid
      const { c_uid, rid, to_uid, content } = ctx.request.body

      const newComment = await CommentService.createComment(
        rid,
        pid,
        c_uid,
        to_uid,
        content
      )

      ctx.body = {
        code: 200,
        message: 'Comment created successfully',
        data: newComment,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to create comment' }
    }
  }

  // 删除单条评论
  async deleteComment(ctx) {
    try {
      const cid = parseInt(ctx.params.cid)

      const deletedComment = await CommentService.deleteComment(cid)

      ctx.body = {
        code: 200,
        message: 'Comment deleted successfully',
        data: deletedComment,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to delete comment' }
    }
  }

  async updateComment(ctx) {
    try {
      const cid = parseInt(ctx.params.cid)
      const { content } = ctx.request.body

      const updatedComment = await CommentService.updateComment(cid, content)

      ctx.body = updatedComment
    } catch (error) {
      console.error('Failed to update comment:', error)
      ctx.status = 500
      ctx.body = { error: 'Failed to update comment' }
    }
  }

  // 根据回帖的 rid 获取回帖的所有评论
  async getCommentsByReplyRid(ctx) {
    try {
      const rid = ctx.query.rid
      const comments = await CommentService.getCommentsByReplyRid(rid)
      ctx.body = {
        code: 200,
        message: 'OK',
        data: comments,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch comments' }
    }
  }
}

export default new CommentController()
