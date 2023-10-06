import { Context } from 'koa'
import ReplyService from '@/service/replyService'
// 操作 cookie 的函数
import { getCookieTokenInfo } from '@/utils/cookies'

class ReplyController {
  // 创建回复
  async createReply(ctx: Context) {
    // 从 cookie 获取用户信息
    const r_uid = getCookieTokenInfo(ctx).uid

    // 从路径获取 tid
    const tid = parseInt(ctx.params.tid as string)

    const { to_uid, to_floor, tags, content } = ctx.request.body

    const savedReply = await ReplyService.createReply(
      tid,
      r_uid,
      to_uid,
      to_floor,
      tags,
      content
    )

    ctx.status = 201
    ctx.body = ctx.body = {
      code: 200,
      message: 'OK',
      data: savedReply,
    }
  }

  // 推
  async updateReplyUpvote(ctx: Context) {
    // 从 cookie 获取用户信息
    const uid = getCookieTokenInfo(ctx).uid

    const to_uid = parseInt(ctx.query.to_uid as string)
    const rid = parseInt(ctx.query.rid as string)

    await ReplyService.updateReplyUpvote(uid, to_uid, rid)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  // 点赞
  async updateReplyLike(ctx: Context) {
    // 从 cookie 获取用户信息
    const uid = getCookieTokenInfo(ctx).uid

    const to_uid = parseInt(ctx.query.to_uid as string)
    const rid = parseInt(ctx.query.rid as string)
    const isPush = ctx.query.isPush === 'true'

    await ReplyService.updateReplyLike(uid, to_uid, rid, isPush)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  // 点踩
  async updateReplyDislike(ctx: Context) {
    // 从 cookie 获取用户信息
    const uid = getCookieTokenInfo(ctx).uid

    const to_uid = parseInt(ctx.query.to_uid as string)
    const rid = parseInt(ctx.query.rid as string)
    const isPush = ctx.query.isPush === 'true'

    await ReplyService.updateReplyDislike(uid, to_uid, rid, isPush)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  // 更新回复
  async updateReply(ctx: Context) {
    try {
      // 从路径获取 tid
      const tid = parseInt(ctx.params.tid as string)

      const { rid, content, tags } = ctx.request.body
      const updatedReply = await ReplyService.updateReply(
        tid,
        rid,
        content,
        tags
      )
      ctx.body = {
        code: 200,
        message: 'OK',
        data: updatedReply,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to update reply' }
    }
  }

  // 获取回复列表
  async getReplies(ctx: Context) {
    try {
      // 从路径获取 tid
      const tid = parseInt(ctx.params.tid as string)

      const pageNumber = parseInt(ctx.query.page as string)
      const limitNumber = parseInt(ctx.query.limit as string)
      const { sortField, sortOrder } = ctx.query

      const data = await ReplyService.getReplies(
        tid,
        pageNumber,
        limitNumber,
        sortField as string,
        <'asc' | 'desc'>sortOrder
      )

      ctx.body = {
        code: 200,
        message: 'OK',
        data,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch replies' }
    }
  }
}

export default new ReplyController()
