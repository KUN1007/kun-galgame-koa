import Router from 'koa-router'
import PostController from '@/controller/postController'

const router = new Router()

router.prefix('/home')

// 获取首页帖子
router.get('/topic', PostController.getPosts)

// 首页搜索帖子
router.get('/topic/search', PostController.searchPosts)

// 获取首页左侧热门帖子
router.get('/nav/hot', PostController.getNavTopPosts)

// 获取首页左侧新发布帖子
router.get('/nav/new', PostController.getNavNewPosts)
export default router
