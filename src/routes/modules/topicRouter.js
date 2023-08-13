import Router from 'koa-router'
import PostController from '@/controller/postController'

const router = new Router()

router.prefix('/topic')

// 获取单个帖子
router.get('/detail/:pid', PostController.getPostByPid)

export default router
