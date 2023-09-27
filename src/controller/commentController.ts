import { Context } from 'koa'
import CommentService from '@/service/commentService'
// 操作 cookie 的函数
import { getCookieTokenInfo } from '@/utils/cookies'

interface TopicCreateCommentRequestData {
  tid: number
  rid: number
  c_uid: number
  to_uid: number
  content: string
}

class CommentController {
  // 发布单条评论
  async createComment(ctx: Context) {
    try {
      const { tid, rid, to_uid, content } = ctx.request.body

      // 当前用户的 uid
      const tidNumber = parseInt(tid)
      const c_uid = getCookieTokenInfo(ctx).uid
      const ridNumber = parseInt(rid.toString())
      const toUidNumber = parseInt(to_uid.toString())
      const newComment = await CommentService.createComment(
        ridNumber,
        tidNumber,
        c_uid,
        toUidNumber,
        content.toString()
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

  // 根据回复的 rid 获取回复下面的所有评论
  async getCommentsByReplyRid(ctx: Context) {
    try {
      const rid = parseInt(ctx.query.rid as string)
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

  // 删除单条评论，暂时用不到
  // async deleteComment(ctx: Context) {
  //   try {
  //     const rid = parseInt(ctx.params.rid)
  //     const cid = parseInt(ctx.params.cid)

  //     const deletedComment = await CommentService.deleteComment(rid, cid)

  //     ctx.body = {
  //       code: 200,
  //       message: 'Comment deleted successfully',
  //       data: deletedComment,
  //     }
  //   } catch (error) {
  //     ctx.status = 500
  //     ctx.body = { error: 'Failed to delete comment' }
  //   }
  // }

  // 更新一条评论，暂时用不到
  // async updateComment(ctx: Context) {
  //   try {
  //     const cid = parseInt(ctx.params.cid)
  //     const { content } = ctx.request.body

  //     const updatedComment = await CommentService.updateComment(cid, content)

  //     ctx.body = updatedComment
  //   } catch (error) {
  //     console.error('Failed to update comment:', error)
  //     ctx.status = 500
  //     ctx.body = { error: 'Failed to update comment' }
  //   }
  // }
}

export default new CommentController()
