import Post from '@/models/post'

class ContentController {
  // 获取文章列表
  async getPostList(ctx) {
    const body = qs.parse(ctx.query)

    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    const options = {}

    if (body.title) {
      options.title = { $regex: body.title }
    }
    if (body.catalog && body.catalog.length > 0) {
      options.catalog = { $in: body.catalog }
    }
    if (body.isTop) {
      options.isTop = body.isTop
    }
    if (body.isEnd) {
      options.isEnd = body.isEnd
    }
    if (body.status) {
      options.status = body.status
    }
    if (typeof body.tag !== 'undefined' && body.tag !== '') {
      options.tags = { $elemMatch: { name: body.tag } }
    }
    const result = await Post.getList(options, sort, page, limit)
    const total = await Post.countList(options)
  }
}

export default new ContentController()
