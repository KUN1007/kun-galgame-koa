import ReplyService from '@/service/replyService'

class ReplyController {
  // 获取回帖列表
  async getReplies(ctx) {
    try {
      const pid = parseInt(ctx.params.pid)
      const page = parseInt(ctx.query.page) || 1
      const limit = parseInt(ctx.query.limit) || 10

      const responseData = await ReplyService.getReplies(pid, page, limit)

      ctx.body = {
        code: 200,
        message: 'OK',
        data: responseData,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch replies' }
    }
  }
}

export default new ReplyController()
