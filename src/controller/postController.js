import PostService from '@/service/postService'

class PostController {
  /*
   * 话题页面
   */

  // 根据话题 id 获取单条话题数据
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

  // 楼主的其它话题，按热度
  async getPopularPostsByUserUid(ctx) {
    try {
      const { uid, pid } = ctx.query
      const popularPosts = await PostService.getPopularPostsByUserUid(uid, pid)

      ctx.body = {
        code: 200,
        message: 'OK',
        data: popularPosts,
      }
    } catch (error) {
      console.error('Failed to get popular posts by user:', error)
      ctx.status = 500
      ctx.body = { error: 'Failed to get popular posts by user' }
    }
  }

  // 相同标签下的其它话题，按热度
  async getRelatedPostsByTags(ctx) {
    try {
      // 传 pid 的目的是过滤掉当前话题
      const { tags, pid } = ctx.query
      const relatedPosts = await PostService.getRelatedPostsByTags(tags, pid)

      ctx.body = {
        code: 200,
        message: 'OK',
        data: relatedPosts,
      }
    } catch (error) {
      console.error('Failed to get related posts by tags:', error)
      ctx.status = 500
      ctx.body = { error: 'Failed to get related posts by tags' }
    }
  }

  /*
   * 编辑界面
   */

  // 创建话题
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

  // 更新话题（标题，内容，标签，分类）
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

  /*
   * 主页
   */

  // 获取话题分页数据，排序
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

  // 首页左边获取热度最高的 10 条话题数据
  async getNavTopPosts(ctx) {
    try {
      const limit = 10 // 设置返回的话题数量
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

  // 首页左边获取最新发布的 10 条话题数据
  async getNavNewPosts(ctx) {
    try {
      const limit = 10 // 设置返回的话题数量
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

  // 按关键词搜索话题
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

  /*
   * 后台管理系统，待定
   */

  // 删除话题
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
}

export default new PostController()
