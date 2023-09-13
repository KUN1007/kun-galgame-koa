import { Context } from 'koa'
import TagService from '@/service/tagService'

class TagController {
  // 获取出现次数最多的标签
  async getTopTags(ctx: Context) {
    // 这里确认前端的 limit 是 string 而不是数组
    const limit = parseInt(ctx.query.limit as string)

    try {
      const topTags = await TagService.getTopTags(limit)
      ctx.body = topTags
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to get top tags' }
    }
  }
  // 删除标签，暂时没有用
  /*   async deleteTag(ctx: Context) {
    try {
      const tagId = parseInt(ctx.params.tagId)
      const deletedTag = await TagService.deleteTag(tagId)
      ctx.body = deletedTag
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to delete tag' }
    }
  } */

  // 创建标签，暂时没有用
  /*     async createTags(ctx: Context) {
      const { tagNames, tid } = ctx.request.body
  
      try {
        const createdTags = await TagService.createTags(tagNames, tid)
        ctx.body = { message: 'Tags created successfully', tags: createdTags }
      } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to create tags' }
      }
    } */
}

export default new TagController()
