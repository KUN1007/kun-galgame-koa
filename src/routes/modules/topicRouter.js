import Router from 'koa-router'
import PostController from '@/controller/postController'
import ReplyController from '@/controller/replyController'

const router = new Router()

router.prefix('/topic')

// 获取单个帖子
router.get('/detail/:pid', PostController.getPostByPid)

// 获取帖子回帖
router.get('/detail/:pid/reply', ReplyController.getReplies)

// 发布单个回帖
router.post('/detail/:pid/reply', ReplyController.createReply)

export default router
