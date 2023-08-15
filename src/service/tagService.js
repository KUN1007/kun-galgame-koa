/*
 * 标签的 CRUD，定义了一些对标签数据的数据库交互操作
 */

import TagModel from '@/models/tagModel'

class TagService {
  // 删除标签
  async deleteTag(tagId) {
    const deletedTag = await TagModel.findOneAndDelete({ tag_id: tagId })
    return deletedTag
  }

  // 更新标签的出现次数
  async updateTagCount(tag, count) {
    const existingTag = await TagModel.findOne({ name: tag })
    if (existingTag) {
      existingTag.count += count
      await existingTag.save()
    } else {
      const newTag = new TagModel({ name: tag, count })
      await newTag.save()
    }
  }
}

export default new TagService()
