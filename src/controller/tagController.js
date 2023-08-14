import TagService from '@/service/tagService'

class TagController {
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
