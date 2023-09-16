import { Context } from 'koa'
import ReplyService from '@/service/replyService'

class ReplyController {
  // 创建回复
  async createReply(ctx: Context) {
    try {
      // 请求的是 /topic/detail/{tid}/reply，tid 会通过 params 拿到
      const tid = parseInt(ctx.params.tid)
      const { r_uid, to_uid, to_floor, tags, content } = ctx.request.body

      const savedReply = await ReplyService.createReply(
        tid,
        r_uid,
        to_uid,
        to_floor,
        tags,
        content
      )

      ctx.status = 201
      ctx.body = ctx.body = {
        code: 200,
        message: 'OK',
        data: savedReply,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to create reply' }
    }
  }

  // 更新回复
  async updateReply(ctx: Context) {
    try {
      const rid = parseInt(ctx.params.rid)
      const tid = parseInt(ctx.params.tid)
      const { content, tags } = ctx.request.body
      const updatedReply = await ReplyService.updateReply(
        tid,
        rid,
        content,
        tags
      )
      ctx.body = {
        code: 200,
        message: 'OK',
        data: updatedReply,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to update reply' }
    }
  }

  // 删除回复
  async deleteReply(ctx: Context) {
    try {
      const rid = parseInt(ctx.params.rid)
      const deletedReply = await ReplyService.deleteReply(rid)
      ctx.body = deletedReply
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to delete reply' }
    }
  }

  // 获取回复列表
  async getReplies(ctx: Context) {
    try {
      const tidNumber = parseInt(ctx.params.tid as string)
      // 这里确定前端会传来 string 而不是 array
      const pageNumber = parseInt(ctx.query.page as string)
      const limitNumber = parseInt(ctx.query.limit as string)
      const { sortField, sortOrder } = ctx.query

      const data = await ReplyService.getReplies(
        tidNumber,
        pageNumber,
        limitNumber,
        sortField as string,
        <'asc' | 'desc'>sortOrder
      )

      ctx.body = {
        code: 200,
        message: 'OK',
        data,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch replies' }
    }
  }

  // 获取单个回复详情，暂时用不到
  /*   async getReplyByRid(ctx: Context) {
    try {
      const rid = parseInt(ctx.params.rid)
      const reply = await ReplyService.getReplyByRid(rid)
      if (!reply) {
        ctx.status = 404
        ctx.body = { error: 'Reply not found' }
        return
      }
      ctx.body = {
        code: 200,
        message: 'OK',
        data: reply,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch reply' }
    }
  } */
}

export default new ReplyController()
