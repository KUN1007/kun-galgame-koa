import Router from 'koa-router'
import TopicController from '@/controller/topicController'

const router = new Router()

router.prefix('/home')

// 获取首页话题，已废弃，和搜索话题合并
// router.get('/topic', TopicController.getTopics)

// 首页搜索话题
router.get('/topic', TopicController.searchTopics)

// 获取首页左侧热门话题
router.get('/nav/hot', TopicController.getNavTopTopics)

// 获取首页左侧新发布话题
router.get('/nav/new', TopicController.getNavNewTopics)

export default router
