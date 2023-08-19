import TagService from '@/service/tagService'

class TagController {
  // 创建标签，暂时没有用
  async createTags(ctx) {
    const { tagNames, tid } = ctx.request.body

    try {
      const createdTags = await TagService.createTags(tagNames, tid)
      ctx.body = { message: 'Tags created successfully', tags: createdTags }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to create tags' }
    }
  }

  // 获取出现次数最多的标签
  async getTopTags(ctx) {
    const { limit } = ctx.query

    try {
      const topTags = await TagService.getTopTags(limit)
      ctx.body = topTags
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to get top tags' }
    }
  }
  // 删除标签
  async deleteTag(ctx) {
    try {
      const tagId = parseInt(ctx.params.tagId)
      const deletedTag = await TagService.deleteTag(tagId)
      ctx.body = deletedTag
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to delete tag' }
    }
  }
}

export default new TagController()
