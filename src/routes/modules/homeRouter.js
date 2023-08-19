import Router from 'koa-router'
import PostController from '@/controller/postController'

const router = new Router()

router.prefix('/home')

// 获取首页话题
router.get('/topic', PostController.getPosts)

// 首页搜索话题
router.get('/topic/search', PostController.searchPosts)

// 获取首页左侧热门话题
router.get('/nav/hot', PostController.getNavTopPosts)

// 获取首页左侧新发布话题
router.get('/nav/new', PostController.getNavNewPosts)
export default router
