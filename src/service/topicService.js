/*
 * 话题的 CRUD，定义了一些对话题数据的数据库交互操作
 */

import TopicModel from '@/models/topicModel'
import TagService from './tagService'
import UserService from './userService'

class TopicService {
  /*
   * 话题页面
   */

  // 根据 tid 获取单个话题信息
  async getTopicByTid(tid) {
    const topic = await TopicModel.findOne({ tid }).lean()
    return topic
  }

  // 楼主的其它话题，按热度
  async getPopularTopicsByUserUid(uid, currentTid) {
    const user = await UserService.getUserByUid(uid)
    // 返回 5 条数据，不包括当前话题
    const popularTIDs = user.topic
      .filter((tid) => tid !== currentTid)
      .slice(0, 5)
    const popularTopics = await TopicModel.find({ tid: { $in: popularTIDs } })
      .sort({ popularity: -1 })
      .limit(5)
      .select('title tid')

    // 去除 _id，保留 title 和 tid 即可
    const topic = popularTopics.map((topic) => ({
      title: topic.title,
      tid: topic.tid,
    }))

    return topic
  }

  // 相同标签下的其它话题，按热度
  async getRelatedTopicsByTags(tags, tidToExclude) {
    // 将传过来的字符串转为数组
    const tagsArray = JSON.parse(tags)
    const relatedTopics = await TopicModel.find({
      tags: { $in: tagsArray },
      // 返回相同标签的话题中排除当前话题
      tid: { $ne: tidToExclude },
    })
      .sort({ popularity: -1 })
      .limit(5)
      .select('title tid')

    // 去除 _id，保留 title 和 tid 即可
    const topic = relatedTopics.map((topic) => ({
      title: topic.title,
      tid: topic.tid,
    }))

    return topic
  }

  /*
   * 编辑页面
   */

  // 创建话题，用于编辑界面
  async createTopic(title, content, time, tags, category, uid) {
    const newTopic = new TopicModel({
      title,
      content,
      time,
      tags: JSON.parse(tags),
      category: JSON.parse(category),
      uid,
    })

    // 保存话题
    const savedTopic = await newTopic.save()

    // 在用户的发帖数组里保存话题
    await UserService.updateUserArray(uid, 'topic', savedTopic.tid)

    // 保存话题 tag
    await TagService.createTagsByTidAndRid(savedTopic.tid, 0, tags, category)

    return savedTopic
  }

  // 更新话题（标题，内容，标签，分类）
  async updateTopic(tid, title, content, tags, category) {
    try {
      const updatedTopic = await TopicModel.findOneAndUpdate(
        { tid },
        { title, content, tags, category },
        { new: true }
      )

      // 使用 TagService 更新标签的使用次数
      await TagService.updateTagsByTidAndRid(tid, 0, tags, category)

      return updatedTopic
    } catch (error) {
      console.log(error)
    }
  }

  /*
   * 主页
   */

  // 首页左边获取热度最高的 10 条话题数据
  async getNavTopTopics(limit) {
    const topics = await TopicModel.find({}, 'tid title popularity')
      .sort({ popularity: -1 })
      .limit(limit)
      .lean()

    const data = topics.map((topic) => ({
      tid: topic.tid,
      title: topic.title,
      popularity: topic.popularity,
    }))

    return data
  }

  // 首页左边获取最新发布的 10 条话题数据
  async getNavNewTopics(limit) {
    const topics = await TopicModel.find({}, 'tid title time')
      .sort({ time: -1 })
      .limit(limit)
      .lean()

    const data = topics.map((topic) => ({
      tid: topic.tid,
      title: topic.title,
      time: topic.time,
    }))

    return data
  }

  // 检索话题，用于搜索框
  /**
   * @param {String} keywords
   * @param {Array} category
   * @param {Number} page
   * @param {Number} limit
   * @param {String} sortField
   * @param {String} sortOrder
   * @returns {Any} topicData
   */
  async searchTopics(keywords, category, page, limit, sortField, sortOrder) {
    const skip = (parseInt(page) - 1) * parseInt(limit)

    // 将传过来的搜索内容按照空格分开搜索
    const keywordsArray = keywords
      .split(' ')
      .filter((keyword) => keyword.trim() !== '')

    // 构建 OR 条件来检索多个字段
    // 使用 $in 条件将每个关键词分别应用于不同的字段进行匹配
    const searchQuery = {
      $or: [
        { title: { $regex: keywordsArray.join('|'), $options: 'i' } },
        { content: { $regex: keywordsArray.join('|'), $options: 'i' } },
        { category: { $in: keywordsArray } },
        { tags: { $in: keywordsArray } },
      ],
    }
    const getQuery = {
      category: { $in: JSON.parse(category) },
    }

    const query = keywords ? searchQuery : getQuery

    const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 }
    // const totalResults = await topicModel.countDocuments(query)

    const topics = await TopicModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'uid avatar name')
      .lean()

    const data = topics.map((topic) => ({
      tid: topic.tid,
      title: topic.title,
      views: topic.views,
      likes: topic.likes,
      replies: topic.replies,
      comments: topic.comments,
      time: topic.time,
      content: topic.content,
      upvotes: topic.upvotes,
      tags: topic.tags,
      category: topic.category,
      popularity: topic.popularity,
      // 这里 populate 后的结果是一个数组，取第一个用户数据
      uid: {
        // 这里去掉了 _id
        uid: topic.user[0].uid,
        avatar: topic.user[0].avatar,
        name: topic.user[0].name,
      },
    }))

    return {
      // totalResults,
      // currentPage: parseInt(page),
      // totalPages: Math.ceil(totalResults / parseInt(limit)),
      data,
    }
  }

  // 删除话题，根据 tid
  async deleteTopic(tid) {
    const deletedTopic = await TopicModel.findOneAndDelete({ tid })

    return deletedTopic
  }

  /*
   * 已废弃
   */
  // 按照关键词获取话题，用于主页话题列表

  // async getTopics(sortField, sortOrder, page, limit) {
  //   const skip = (parseInt(page) - 1) * limit
  //   const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 }

  //   const topics = await TopicModel.find()
  //     .sort(sortOptions)
  //     .skip(skip)
  //     .limit(limit)
  //     .populate('user', 'uid avatar name')
  //     .lean()

  //   const data = topics.map((topic) => ({
  //     tid: topic.tid,
  //     title: topic.title,
  //     views: topic.views,
  //     likes: topic.likes,
  //     replies: topic.replies,
  //     comments: topic.comments,
  //     time: topic.time,
  //     content: topic.content,
  //     upvotes: topic.upvotes,
  //     popularity: topic.popularity,
  //     // 这里 populate 后的结果是一个数组，取第一个用户数据
  //     uid: {
  //       // 这里去掉了 _id
  //       uid: topic.user[0].uid,
  //       avatar: topic.user[0].avatar,
  //       name: topic.user[0].name,
  //     },
  //   }))

  //   return data
  // }
}

export default new TopicService()
