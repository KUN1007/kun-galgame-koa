import PostModel from '@/models/postModel'

class PostService {
  // 创建帖子
  async createPost(title, content, time, tags, category, uid) {
    try {
      const newPost = new PostModel({
        title,
        content,
        time,
        tags,
        category,
        uid,
      })

      const savedPost = await newPost.save()

      return savedPost
    } catch (error) {
      throw new Error('Failed to create post')
    }
  }

  // 按照关键词获取帖子
  async getPosts(sortField, sortOrder, page, limit) {
    try {
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
        uid: post.user[0] // 检查是否有用户信息填充
          ? {
              uid: post.user[0].uid,
              avatar: post.user[0].avatar,
              name: post.user[0].name,
            }
          : null,
      }))

      return data
    } catch (error) {
      throw new Error('Failed to fetch posts')
    }
  }

  // 更新帖子（标题和内容）
  async updatePost(pid, title, content) {
    try {
      const updatedPost = await PostModel.findOneAndUpdate(
        { pid },
        { title, content },
        { new: true }
      )

      return updatedPost
    } catch (error) {
      throw new Error('Failed to update post')
    }
  }

  // 删除帖子，根据 pid
  async deletePost(pid) {
    try {
      const deletedPost = await PostModel.findOneAndDelete({ pid })

      return deletedPost
    } catch (error) {
      throw new Error('Failed to delete post')
    }
  }

  // 首页左边获取热度最高的 10 条帖子数据
  async getNavTopPosts(limit) {
    try {
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
    } catch (error) {
      throw new Error('Failed to fetch top posts')
    }
  }

  // 首页左边获取最新发布的 10 条帖子数据
  async getNavNewPosts(limit) {
    try {
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
    } catch (error) {
      throw new Error('Failed to fetch top posts')
    }
  }

  // 检索帖子
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
        { title: { $in: keywordsArray, $options: 'i' } },
        { category: { $in: keywordsArray, $options: 'i' } },
        { tags: { $in: keywordsArray, $options: 'i' } },
        { content: { $in: keywordsArray, $options: 'i' } },
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
}

export default new PostService()
