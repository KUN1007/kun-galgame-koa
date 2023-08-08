import Router from 'koa-router'
import PostController from '@/controller/postController'

const router = new Router()

router.prefix('/home')

// 获取帖子
router.post('/topic', PostController.getPosts)

export default router
