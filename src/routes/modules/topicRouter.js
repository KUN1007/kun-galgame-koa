import Router from 'koa-router'
import TopicController from '@/controller/topicController'
import ReplyController from '@/controller/replyController'
import CommentController from '@/controller/commentController'

const router = new Router()

router.prefix('/topic')

/*
 * 话题相关
 */

// 获取单个话题
router.get('/detail/:tid', TopicController.getTopicByTid)

// 左侧相同标签下的其它话题
router.get('/nav/same', TopicController.getRelatedTopicsByTags)

// 楼主的其它话题
router.get('/nav/master', TopicController.getPopularTopicsByUserUid)

/*
 * 回复相关
 */

// 发布单个回复
router.post('/detail/:tid/reply', ReplyController.createReply)

// 根据话题 id 获取话题回复
router.get('/detail/:tid/reply', ReplyController.getReplies)

// 更新单个回复
router.put('/detail/:tid/reply/:rid', ReplyController.updateReply)

/*
 * 评论相关
 */

// 发布单个评论
router.post('/detail/:tid/comment', CommentController.createComment)

// 获取一个回复下面的评论
router.get('/detail/:tid/comment', CommentController.getCommentsByReplyRid)

// 更新单个评论
router.put('/detail/:tid/comment/:cid', CommentController.updateComment)

// 删除单个评论
// router.delete('/detail/:tid/comment/:cid', CommentController.deleteComment)

export default router
