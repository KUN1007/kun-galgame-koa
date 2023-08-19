import Router from 'koa-router'
import PostController from '@/controller/postController'
import ReplyController from '@/controller/replyController'
import CommentController from '@/controller/commentController'

const router = new Router()

router.prefix('/topic')

/*
 * 帖子相关
 */

// 获取单个帖子
router.get('/detail/:pid', PostController.getPostByPid)

// 左侧相同标签下的其它帖子
router.get('/nav/same', PostController.getRelatedPostsByTags)

// 楼主的其它帖子
router.get('/nav/master', PostController.getPopularPostsByUserUid)

/*
 * 回帖相关
 */

// 发布单个回帖
router.post('/detail/:pid/reply', ReplyController.createReply)

// 根据帖子 id 获取帖子回帖
router.get('/detail/:pid/reply', ReplyController.getReplies)

// 更新单个回帖
router.put('/detail/:pid/reply/:rid', ReplyController.updateReply)

/*
 * 评论相关
 */

// 发布单个评论
router.post('/detail/:pid/comment', CommentController.createComment)

// 获取一个回帖下面的评论
router.get('/detail/:pid/comment', CommentController.getCommentsByReplyRid)

// 更新单个评论
router.put('/detail/:pid/comment/:cid', CommentController.updateComment)

// 删除单个评论
// router.delete('/detail/:pid/comment/:cid', CommentController.deleteComment)

export default router
