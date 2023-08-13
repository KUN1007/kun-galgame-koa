import Router from 'koa-router'
import PostController from '@/controller/postController'

const router = new Router()

router.prefix('/edit')

// 发布帖子
router.post('/', PostController.createPost)

// 更新帖子
router.put('/', PostController.updatePost)

export default router