import { Context } from 'koa'
import TopicService from '@/service/topicService'
// 操作 cookie 的函数
import { getCookieTokenInfo } from '@/utils/cookies'

class TopicController {
  /*
   * 话题页面
   */

  // 根据话题 id 获取单条话题数据
  async getTopicByTid(ctx: Context) {
    try {
      const tid = parseInt(ctx.params.tid as string)
      const topic = await TopicService.getTopicByTid(tid)

      if (!topic) {
        ctx.body = { code: '404', message: 'Topic not found', data: {} }
        return
      }

      ctx.body = {
        code: 200,
        message: 'OK',
        data: topic,
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        message: 'Failed to fetch topic',
        data: { error },
      }
    }
  }

  // 点赞话题
  async updateTopicLike(ctx: Context) {
    try {
      // 从 cookie 获取用户信息
      const uid = getCookieTokenInfo(ctx).uid

      const tid = parseInt(ctx.params.tid as string)

      const to_uid = parseInt(ctx.query.to_uid as string)
      const isPush = ctx.query.isPush === 'true'
      await TopicService.updateTopicLike(uid, to_uid, tid, isPush)

      ctx.body = {
        code: 200,
        message: 'OK',
        data: {},
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        message: 'Failed to fetch topic',
        data: { error },
      }
    }
  }

  // 楼主的其它话题，按热度
  async getPopularTopicsByUserUid(ctx: Context) {
    try {
      // 从 cookie 获取用户信息
      const uid = getCookieTokenInfo(ctx).uid

      const tid = parseInt(ctx.params.tid as string)

      const popularTopics = await TopicService.getPopularTopicsByUserUid(
        uid,
        tid
      )

      ctx.body = {
        code: 200,
        message: 'OK',
        data: popularTopics,
      }
    } catch (error) {
      console.error('Failed to get popular topics by user:', error)
      ctx.status = 500
      ctx.body = { error: 'Failed to get popular topics by user' }
    }
  }

  // 相同标签下的其它话题，按热度
  async getRelatedTopicsByTags(ctx: Context) {
    try {
      const tid = parseInt(ctx.params.tid as string)
      // 传 tid 的目的是过滤掉当前话题
      const { tags } = ctx.query

      const tagsArray = tags.toString().split(',')
      const relatedTopics = await TopicService.getRelatedTopicsByTags(
        tagsArray,
        tid
      )

      ctx.body = {
        code: 200,
        message: 'OK',
        data: relatedTopics,
      }
    } catch (error) {
      console.error('Failed to get related topics by tags:', error)
      ctx.status = 500
      ctx.body = { error: 'Failed to get related topics by tags' }
    }
  }

  /*
   * 编辑界面
   */

  // 创建话题
  async createTopic(ctx: Context) {
    try {
      // 从 cookie 获取用户信息
      const uid = getCookieTokenInfo(ctx).uid
      const { title, content, time, tags, category } = ctx.request.body

      const tid = await TopicService.createTopic(
        title,
        content,
        time,
        tags,
        category,
        uid
      )

      ctx.body = { code: 200, message: 'OK', data: { tid } }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to create topic' }
    }
  }

  // 更新话题（标题，内容，标签，分类）
  async updateTopic(ctx: Context) {
    try {
      // 从 cookie 获取用户信息
      const uid = getCookieTokenInfo(ctx).uid

      const tid = parseInt(ctx.params.tid as string)

      const { title, content, tags, category } = ctx.request.body

      await TopicService.updateTopic(uid, tid, title, content, tags, category)

      ctx.body = {
        code: 200,
        message: 'OK',
        data: {},
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to update topic' }
    }
  }

  /*
   * 主页
   */

  // 首页左边获取热度最高的 10 条话题数据
  async getNavTopTopics(ctx: Context) {
    try {
      const limit = 10 // 设置返回的话题数量
      const data = await TopicService.getNavTopTopics(limit)

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
  async getNavNewTopics(ctx: Context) {
    try {
      const limit = 10 // 设置返回的话题数量
      const data = await TopicService.getNavNewTopics(limit)

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
  async searchTopics(ctx: Context) {
    try {
      const { keywords, category, page, limit, sortField, sortOrder } =
        ctx.query
      const data = await TopicService.searchTopics(
        keywords as string,
        category as string[],
        parseInt(page as string),
        parseInt(limit as string),
        sortField as string,
        <'asc' | 'desc'>sortOrder
      )
      ctx.body = { code: 200, message: 'OK', data: data.data }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch search results' }
    }
  }
}

export default new TopicController()
