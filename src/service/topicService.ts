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
  async getTopicByTid(tid: number) {
    try {
      // 用户每次访问话题，增加 views 字段值
      // $inc 操作符通常用于在不锁定文档的情况下对字段进行增量更新，这对于并发操作非常有用，因为它确保了原子性
      await TopicModel.updateOne({ tid }, { $inc: { views: 1 } })

      const topic = await TopicModel.findOne({ tid }).lean()

      const userInfo = await UserService.getUserInfoByUid(topic.uid, [
        'uid',
        'avatar',
        'name',
        'moemoepoint',
      ])

      const data = {
        tid: topic.tid,
        title: topic.title,
        views: topic.views,
        likes: topic.likes,
        dislikes: topic.dislikes,
        time: topic.time,
        content: topic.content,
        upvotes: topic.upvotes,
        tags: topic.tags,
        edited: topic.edited,
        user: {
          uid: userInfo.uid,
          name: userInfo.name,
          avatar: userInfo.avatar,
          moemoepoint: userInfo.moemoepoint,
        },
        rid: topic.rid,
        status: topic.status,
        share: topic.share,
      }

      return data
    } catch (error) {
      console.log(error)
    }
  }

  // 楼主的其它话题，按热度
  async getPopularTopicsByUserUid(uid: number, tidToExclude: number) {
    const user = await UserService.getUserInfoByUid(uid, ['topic'])
    // 返回 5 条数据，不包括当前话题
    const popularTIDs = user.topic
    const popularTopics = await TopicModel.find({
      tid: { $in: popularTIDs, $ne: tidToExclude },
    })
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
  async getRelatedTopicsByTags(tags: string[], tidToExclude: number) {
    const relatedTopics = await TopicModel.find({
      tags: { $in: tags },
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
  async createTopic(
    title: string,
    content: string,
    time: number,
    tags: string[],
    category: string[],
    uid: number
  ) {
    try {
      const newTopic = new TopicModel({
        title,
        content,
        time,
        tags,
        category,
        uid,
      })

      // 保存话题
      const savedTopic = await newTopic.save()

      // 在用户的发帖数组里保存话题
      await UserService.updateUserArray(uid, 'topic', savedTopic.tid)

      // 保存话题 tag
      await TagService.createTagsByTidAndRid(savedTopic.tid, 0, tags, category)

      // 返回创建好话题的 tid
      return savedTopic.tid
    } catch (error) {
      console.log(error)
    }
  }

  // 更新话题（标题，内容，标签，分类）
  async updateTopic(
    uid: number,
    tid: number,
    title: string,
    content: string,
    tags: string[],
    category: string[]
  ) {
    try {
      const updatedTopic = await TopicModel.findOneAndUpdate(
        { tid },
        { title, content, tags, category },
        { new: true }
      )

      // 使用 TagService 更新标签的使用次数
      await TagService.updateTagsByTidAndRid(tid, 0, tags, category)

      const updatedData = {
        title: updatedTopic.title,
        content: updatedTopic.content,
        tags: updatedTopic.tags,
        category: updatedTopic.category,
      }

      return updatedData
    } catch (error) {
      console.log(error)
    }
  }

  /*
   * 主页
   */

  // 首页左边获取热度最高的 10 条话题数据
  async getNavTopTopics(limit: number) {
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
  async getNavNewTopics(limit: number) {
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
   * @param {String} keywords - 搜索关键词，不填默认全部
   * @param {Array} category - 话题的分类，目前有三种，Galgame, Technique, Others
   * @param {Number} page - 分页页数
   * @param {Number} limit - 每页的数据数
   * @param {String} sortField - 按照哪个字段排序
   * @param {String} sortOrder - 排序的顺序，有 `asc`, `desc`
   * @returns {HomeTopicResponseData} topicData
   */
  async searchTopics(
    keywords: string,
    category: string[],
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string
  ) {
    const skip = (page - 1) * limit

    // 将传过来的搜索内容按照空格分开搜索
    const keywordsArray = keywords
      .split(' ')
      .filter((keyword) => keyword.trim() !== '')

    // 对特殊字符进行转义
    const escapedKeywords = keywordsArray.map((keyword) =>
      keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )

    // 构建 OR 条件来检索多个字段
    // 使用 $in 条件将每个关键词分别应用于不同的字段进行匹配
    // 提供 keywords 时的查询
    const searchQuery = {
      $and: [
        { category: { $in: category } },
        {
          $or: [
            { title: { $regex: escapedKeywords.join('|'), $options: 'i' } },
            { content: { $regex: escapedKeywords.join('|'), $options: 'i' } },
            { category: { $in: escapedKeywords } },
            { tags: { $in: escapedKeywords } },
          ],
        },
      ],
    }

    // 不提供 keyword 时的查询
    const getQuery = {
      category: { $in: category },
    }

    const query = keywords ? searchQuery : getQuery

    const sortOptions: Record<string, 'asc' | 'desc'> = {
      [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
    }
    // const totalResults = await topicModel.countDocuments(query)

    const topics = await TopicModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('user', 'uid avatar name')
      .lean()

    const data = topics.map((topic) => ({
      tid: topic.tid,
      title: topic.title,
      views: topic.views,
      likes: topic.likes,
      // 这里需要的仅仅是 reply 的数量而已
      replies: topic.rid,
      comments: topic.comments,
      time: topic.time,
      content: topic.content,
      upvotes: topic.upvotes,
      tags: topic.tags,
      category: topic.category,
      popularity: topic.popularity,
      // 这里 populate 后的结果是一个数组，取第一个用户数据
      user: {
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
  // async deleteTopic(tid) {
  //   const deletedTopic = await TopicModel.findOneAndDelete({ tid })

  //   return deletedTopic
  // }

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
