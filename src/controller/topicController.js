import TopicService from '@/service/topicService'

class TopicController {
  /*
   * 话题页面
   */

  // 根据话题 id 获取单条话题数据
  async getTopicByTid(ctx) {
    try {
      const tid = parseInt(ctx.params.tid)
      const topic = await TopicService.getTopicByTid(tid)

      if (!topic) {
        ctx.status = 404
        ctx.body = { error: 'Topic not found' }
        return
      }

      ctx.body = {
        code: 200,
        message: 'OK',
        data: topic,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch topic' }
    }
  }

  // 楼主的其它话题，按热度
  async getPopularTopicsByUserUid(ctx) {
    try {
      const { uid, tid } = ctx.query
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
  async getRelatedTopicsByTags(ctx) {
    try {
      // 传 tid 的目的是过滤掉当前话题
      const { tags, tid } = ctx.query
      const relatedTopics = await TopicService.getRelatedTopicsByTags(tags, tid)

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
  async createTopic(ctx) {
    try {
      const { title, content, time, tags, category, uid } = ctx.request.body

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
  async updateTopic(ctx) {
    try {
      const tid = ctx.params.tid
      const { title, content, tags, category } = ctx.request.body

      const updatedTopic = await TopicService.updateTopic(
        tid,
        title,
        content,
        tags,
        category
      )

      ctx.body = {
        code: 200,
        message: 'OK',
        data: updatedTopic,
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
  async getNavTopTopics(ctx) {
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
  async getNavNewTopics(ctx) {
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
  async searchTopics(ctx) {
    try {
      const { keywords, category, page, limit, sortField, sortOrder } =
        ctx.query
      const data = await TopicService.searchTopics(
        keywords,
        category,
        page,
        limit,
        sortField,
        sortOrder
      )
      ctx.body = { code: 200, message: 'OK', data: data.data }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch search results' }
    }
  }

  /*
   * 后台管理系统，待定
   */

  // 删除话题
  async deleteTopic(ctx) {
    try {
      const tid = ctx.params.tid

      const deletedTopic = await TopicService.deleteTopic(tid)

      ctx.body = deletedTopic
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to delete topic' }
    }
  }

  /*
   * 已废弃
   */
  // 获取话题分页数据，排序
  // async getTopics(ctx) {
  //   try {
  //     const { sortField, sortOrder, page, limit } = ctx.query

  //     const data = await TopicService.getTopics(
  //       sortField,
  //       sortOrder,
  //       page,
  //       limit
  //     )

  //     ctx.body = { code: 200, message: 'OK', data: data }
  //   } catch (error) {
  //     ctx.status = 500
  //     ctx.body = { error: 'Failed to fetch topics' }
  //   }
  // }
}

export default new TopicController()
