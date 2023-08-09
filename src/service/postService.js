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
}

export default new PostService()
