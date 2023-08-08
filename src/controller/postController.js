import PostService from '@/service//postService'

class PostController {
  // 创建帖子
  async createPost(ctx) {
    try {
      const { title, content, time, tags, category } = ctx.request.body
      const uid = ctx.state.user.uid // Assuming user information is stored in the ctx.state.user

      const savedPost = await PostService.createPost(
        title,
        content,
        time,
        tags,
        category,
        uid
      )

      ctx.status = 201
      ctx.body = savedPost
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to create post' }
    }
  }

  // 根据关键词获取帖子数据
  async getPosts(ctx) {
    try {
      const { sortField, sortOrder, page, limit } = ctx.query

      const data = await PostService.getPosts(sortField, sortOrder, page, limit)

      ctx.body = { code: 200, message: 'OK', data: data }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch posts' }
    }
  }

  // 更新帖子（标题和内容）
  async updatePost(ctx) {
    try {
      const pid = ctx.params.pid // Assuming the pid is passed as a route parameter
      const { title, content } = ctx.request.body

      const updatedPost = await PostService.updatePost(pid, title, content)

      ctx.body = updatedPost
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to update post' }
    }
  }

  // 删除帖子
  async deletePost(ctx) {
    try {
      const pid = ctx.params.pid // Assuming the pid is passed as a route parameter

      const deletedPost = await PostService.deletePost(pid)

      ctx.body = deletedPost
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to delete post' }
    }
  }
}

export default new PostController()
