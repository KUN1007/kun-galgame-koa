/*
 * 话题的 CRUD，定义了一些对话题数据的数据库交互操作
 */

import PostModel from '@/models/postModel'
import TagService from './tagService'
import UserService from './userService'

class PostService {
  /*
   * 话题页面
   */

  // 根据 pid 获取单个话题信息
  async getPostByPid(pid) {
    const post = await PostModel.findOne({ pid }).lean()
    return post
  }

  // 楼主的其它话题，按热度
  async getPopularPostsByUserUid(uid, currentPid) {
    const user = await UserService.getUserByUid(uid)
    // 返回 5 条数据，不包括当前话题
    const popularPIDs = user.topic
      .filter((pid) => pid !== currentPid)
      .slice(0, 5)
    const popularPosts = await PostModel.find({ pid: { $in: popularPIDs } })
      .sort({ popularity: -1 })
      .limit(5)
      .select('title pid')

    // 去除 _id，保留 title 和 pid 即可
    const post = popularPosts.map((post) => ({
      title: post.title,
      pid: post.pid,
    }))

    return post
  }

  // 相同标签下的其它话题，按热度
  async getRelatedPostsByTags(tags, pidToExclude) {
    // 将传过来的字符串转为数组
    const tagsArray = JSON.parse(tags)
    const relatedPosts = await PostModel.find({
      tags: { $in: tagsArray },
      // 返回相同标签的话题中排除当前话题
      pid: { $ne: pidToExclude },
    })
      .sort({ popularity: -1 })
      .limit(5)
      .select('title pid')

    // 去除 _id，保留 title 和 pid 即可
    const post = relatedPosts.map((post) => ({
      title: post.title,
      pid: post.pid,
    }))

    return post
  }

  /*
   * 编辑页面
   */

  // 创建话题，用于编辑界面
  async createPost(title, content, time, tags, category, uid) {
    const newPost = new PostModel({
      title,
      content,
      time,
      tags: JSON.parse(tags),
      category: JSON.parse(category),
      uid,
    })

    // 保存话题
    const savedPost = await newPost.save()

    // 在用户的发帖数组里保存话题
    await UserService.updateUserArray(uid, 'topic', savedPost.pid)

    // 保存话题 tag
    await TagService.createTagsByPidAndRid(savedPost.pid, 0, tags, category)

    return savedPost
  }

  // 更新话题（标题，内容，标签，分类）
  async updatePost(pid, title, content, tags, category) {
    try {
      const updatedPost = await PostModel.findOneAndUpdate(
        { pid },
        { title, content, tags, category },
        { new: true }
      )

      // 使用 TagService 更新标签的使用次数
      await TagService.updateTagsByPidAndRid(pid, 0, tags, category)

      return updatedPost
    } catch (error) {
      console.log(error)
    }
  }

  /*
   * 主页
   */

  // 按照关键词获取话题，用于主页话题列表
  async getPosts(sortField, sortOrder, page, limit) {
    const skip = (parseInt(page) - 1) * limit
    const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 }

    const posts = await PostModel.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('user', 'uid avatar name')
      .lean()

    const data = posts.map((post) => ({
      tid: post.pid,
      title: post.title,
      views: post.views,
      likes: post.likes,
      replies: post.replies,
      comments: post.comments,
      time: post.time,
      content: post.content,
      upvotes: post.upvotes,
      // 这里 populate 后的结果是一个数组，取第一个用户数据
      uid: {
        // 这里去掉了 _id
        uid: post.user[0].uid,
        avatar: post.user[0].avatar,
        name: post.user[0].name,
      },
    }))

    return data
  }

  // 首页左边获取热度最高的 10 条话题数据
  async getNavTopPosts(limit) {
    const posts = await PostModel.find({}, 'pid title popularity')
      .sort({ popularity: -1 })
      .limit(limit)
      .lean()

    const data = posts.map((post) => ({
      pid: post.pid,
      title: post.title,
      popularity: post.popularity,
    }))

    return data
  }

  // 首页左边获取最新发布的 10 条话题数据
  async getNavNewPosts(limit) {
    const posts = await PostModel.find({}, 'pid title time')
      .sort({ time: -1 })
      .limit(limit)
      .lean()

    const data = posts.map((post) => ({
      pid: post.pid,
      title: post.title,
      time: post.time,
    }))

    return data
  }

  // 检索话题，用于搜索框
  async searchPosts(keywords, page, limit, sortBy, sortOrder) {
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
        { category: { $regex: keywordsArray.join('|'), $options: 'i' } },
        { tags: { $in: keywordsArray } },
        { content: { $regex: keywordsArray.join('|'), $options: 'i' } },
      ],
    }

    // const totalResults = await PostModel.countDocuments(searchQuery)
    let sortOptions = {}
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1
    }

    const posts = await PostModel.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    return {
      // totalResults,
      // currentPage: parseInt(page),
      // totalPages: Math.ceil(totalResults / parseInt(limit)),
      posts,
    }
  }

  // 删除话题，根据 pid
  async deletePost(pid) {
    const deletedPost = await PostModel.findOneAndDelete({ pid })

    return deletedPost
  }
}

export default new PostService()
