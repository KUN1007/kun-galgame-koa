import { Context } from 'koa'
import TagService from '@/service/tagService'

class TagController {
  // 获取出现次数最多的标签
  async getTopTags(ctx: Context) {
    // 这里确认前端的 limit 是 string 而不是数组
    const limit = parseInt(ctx.query.limit as string)

    const topTags = await TagService.getTopTags(limit)
    ctx.body = {
      code: 200,
      message: 'OK',
      data: topTags,
    }
  }
}

export default new TagController()
