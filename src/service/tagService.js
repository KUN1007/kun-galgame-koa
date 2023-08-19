/*
 * 标签的 CRUD，定义了一些对标签数据的数据库交互操作
 */

import TagModel from '@/models/tagModel'

class TagService {
  async createTagsByTidAndRid(tid, rid, tagNames, category) {
    try {
      // 这里接收的是字符串，将其转为数组
      const tagsArray = Array.isArray(tagNames)
        ? tagNames
        : JSON.parse(tagNames)
      // 数组去重
      const uniqueTagNames = [...new Set(tagsArray)]
      const createdTags = []

      for (const tagName of uniqueTagNames) {
        const newTag = new TagModel({ name: tagName, tid, rid, category })
        const savedTag = await newTag.save()
        createdTags.push(savedTag)
      }

      return createdTags
    } catch (error) {
      console.error('Failed to create tags:', error)
      throw error
    }
  }

  // 根据 tid 和 rid 更新 tags
  async updateTagsByTidAndRid(tid, rid, tags, category) {
    try {
      // 这里接收的是字符串，将其转为数组
      const tagsArray = JSON.parse(tags)

      // 找出相同 tid 和 rid 下已经存在的 tag
      const existingTags = await TagModel.find({ tid, rid })
      const existingTagNames = existingTags.map((tag) => tag.name)

      // 找出需要增加的 tag
      const tagsToAdd = tagsArray.filter(
        (tag) => !existingTagNames.includes(tag)
      )

      // 找出需要删除的 tag
      const tagsToRemove = existingTagNames.filter(
        (tag) => !tagsArray.includes(tag)
      )

      // 创建要增加的 tag
      await this.createTagsByTidAndRid(tid, rid, tagsToAdd, category)

      // 删除要删除的 tag
      for (const tagToRemove of tagsToRemove) {
        await TagModel.deleteOne({ tid, rid, name: tagToRemove })
      }
    } catch (error) {
      console.error('Failed to update tags:', error)
      throw error
    }
  }

  // 获取出现次数最多的 10 个 tag
  async getTopTags(limit = 10) {
    const topTags = await TagModel.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ])

    return topTags
  }

  // 删除标签，暂时没用
  async deleteTag(tagId) {
    const deletedTag = await TagModel.findOneAndDelete({ tag_id: tagId })
    return deletedTag
  }
}

export default new TagService()
