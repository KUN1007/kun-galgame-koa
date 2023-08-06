import Router from 'koa-router'
import Post from '@/models/postModel'

const router = new Router()

router.prefix('/post')

export default router
