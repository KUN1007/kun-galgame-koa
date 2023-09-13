import Router from 'koa-router'
import TopicController from '@/controller/topicController'

const router = new Router()

router.prefix('/edit')

// 发布话题
router.post('/topic', TopicController.createTopic)

// 更新话题
router.put('/topic/:tid', TopicController.updateTopic)

export default router
