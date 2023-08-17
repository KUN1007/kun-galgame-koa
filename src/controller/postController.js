import PostService from '@/service/postService'

class PostController {
  // 创建帖子
  async createPost(ctx) {
    try {
      const { title, content, time, tags, category, uid } = ctx.request.body

      const postData = await PostService.createPost(
        title,
        content,
        time,
        tags,
        category,
        uid
      )

      ctx.body = { code: 200, message: 'OK', data: postData }
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

  // 根据关键词获取单条帖子数据
  async getPostByPid(ctx) {
    try {
      const pid = parseInt(ctx.params.pid)
      const post = await PostService.getPostByPid(pid)

      if (!post) {
        ctx.status = 404
        ctx.body = { error: 'Post not found' }
        return
      }

      ctx.body = {
        code: 200,
        message: 'OK',
        data: post,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch post' }
    }
  }

  // 更新帖子（标题和内容）
  async updatePost(ctx) {
    try {
      const pid = ctx.params.pid
      const { title, content, tags, category } = ctx.request.body

      const updatedPost = await PostService.updatePost(
        pid,
        title,
        content,
        tags,
        category
      )

      ctx.body = {
        code: 200,
        message: 'OK',
        data: updatedPost,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to update post' }
    }
  }

  // 删除帖子
  async deletePost(ctx) {
    try {
      const pid = ctx.params.pid

      const deletedPost = await PostService.deletePost(pid)

      ctx.body = deletedPost
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to delete post' }
    }
  }

  // 首页左边获取热度最高的 10 条帖子数据
  async getNavTopPosts(ctx) {
    try {
      const limit = 10 // 设置返回的帖子数量
      const data = await PostService.getNavTopPosts(limit)

      ctx.body = {
        code: 200,
        message: 'OK',
        data: data,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: 'Internal Server Error',
      }
    }
  }

  // 首页左边获取最新发布的 10 条帖子数据
  async getNavNewPosts(ctx) {
    try {
      const limit = 10 // 设置返回的帖子数量
      const data = await PostService.getNavNewPosts(limit)

      ctx.body = {
        code: 200,
        message: 'OK',
        data: data,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: 'Internal Server Error',
      }
    }
  }

  // 按关键词搜索帖子
  async searchPosts(ctx) {
    try {
      const { keywords, page, limit, sortBy, sortOrder } = ctx.query
      const data = await PostService.searchPosts(
        keywords,
        page,
        limit,
        sortBy,
        sortOrder
      )
      ctx.body = { code: 200, message: 'OK', data }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch search results' }
    }
  }
}

export default new PostController()
