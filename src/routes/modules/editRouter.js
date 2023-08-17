import Router from 'koa-router'
import PostController from '@/controller/postController'

const router = new Router()

router.prefix('/edit')

// 发布帖子
router.post('/topic', PostController.createPost)

// 更新帖子
router.put('/topic/:pid', PostController.updatePost)

export default router
