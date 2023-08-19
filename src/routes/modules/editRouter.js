import Router from 'koa-router'
import PostController from '@/controller/postController'

const router = new Router()

router.prefix('/edit')

// 发布话题
router.post('/topic', PostController.createPost)

// 更新话题
router.put('/topic/:pid', PostController.updatePost)

export default router
