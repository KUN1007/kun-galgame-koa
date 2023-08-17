import ReplyService from '@/service/replyService'

class ReplyController {
  // 创建回帖
  async createReply(ctx) {
    try {
      // 请求的是 /topic/detail/{pid}/reply，pid 会通过 params 拿到
      const pid = parseInt(ctx.params.pid)
      const { r_uid, to_uid, tags, content } = ctx.request.body

      const savedReply = await ReplyService.createReply(
        pid,
        r_uid,
        to_uid,
        tags,
        content
      )
      ctx.status = 201
      ctx.body = savedReply
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to create reply' }
    }
  }

  // 获取单个回帖详情
  async getReplyByRid(ctx) {
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
  }

  // 更新回帖
  async updateReply(ctx) {
    try {
      const rid = parseInt(ctx.params.rid)
      const { content } = ctx.request.body
      const updatedReply = await ReplyService.updateReply(rid, content)
      ctx.body = updatedReply
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to update reply' }
    }
  }

  // 删除回帖
  async deleteReply(ctx) {
    try {
      const rid = parseInt(ctx.params.rid)
      const deletedReply = await ReplyService.deleteReply(rid)
      ctx.body = deletedReply
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to delete reply' }
    }
  }

  // 获取回帖列表
  async getReplies(ctx) {
    try {
      const pid = parseInt(ctx.params.pid)
      const page = parseInt(ctx.query.page) || 1
      const limit = parseInt(ctx.query.limit) || 10
      const { sortField, sortOrder } = ctx.query

      const data = await ReplyService.getReplies(
        pid,
        page,
        limit,
        sortField,
        sortOrder
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
}

export default new ReplyController()
