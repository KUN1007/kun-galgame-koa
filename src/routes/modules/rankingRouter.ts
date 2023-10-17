import Router from 'koa-router'
import TopicController from '@/controller/topicController'

const router = new Router()

router.prefix('/ranking')

// 获取热门话题，用于 ranking
router.get('/topics', TopicController.getTopicRanking)

export default router
