import Router from 'koa-router'
import PostController from '@/controller/postController'
import ReplyController from '@/controller/replyController'
import CommentController from '@/controller/commentController'

const router = new Router()

router.prefix('/topic')

// 获取单个帖子
router.get('/detail/:pid', PostController.getPostByPid)

// 根据帖子 id 获取帖子回帖
router.get('/detail/:pid/reply', ReplyController.getReplies)

// 发布单个回帖
router.post('/detail/:pid/reply', ReplyController.createReply)

// 更新单个回帖
router.put('/detail/:pid/reply/:rid', ReplyController.updateReply)

// 获取一个回帖下面的评论
router.get('/detail/:pid/comment', CommentController.getCommentsByReplyRid)

// 发布单个评论
router.post('/detail/:pid/comment', CommentController.createComment)

// 删除单个评论
// router.delete('/detail/:pid/comment/:cid', CommentController.deleteComment)

export default router
