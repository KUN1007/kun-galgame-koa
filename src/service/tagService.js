import TagModel from '@/models/tagModel'

class TagService {
  // 删除标签
  async deleteTag(tagId) {
    try {
      const deletedTag = await TagModel.findOneAndDelete({ tag_id: tagId })
      return deletedTag
    } catch (error) {
      throw new Error('Failed to delete tag')
    }
  }

  // 更新标签的出现次数
  async updateTagCount(tag, count) {
    try {
      const existingTag = await TagModel.findOne({ name: tag })
      if (existingTag) {
        existingTag.count += count
        await existingTag.save()
      } else {
        const newTag = new TagModel({ name: tag, count })
        await newTag.save()
      }
    } catch (error) {
      throw new Error('Failed to update tag count')
    }
  }
}

export default new TagService()
