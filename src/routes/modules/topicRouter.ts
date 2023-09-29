import Router from 'koa-router'
import TopicController from '@/controller/topicController'
import ReplyController from '@/controller/replyController'
import CommentController from '@/controller/commentController'

const router = new Router()

router.prefix('/topics')

/*
 * 话题相关
 */

// 发布话题
router.post('/', TopicController.createTopic)

// 获取单个话题
router.get('/:tid', TopicController.getTopicByTid)

// 更新话题
router.put('/:tid', TopicController.updateTopic)

// 点赞话题
router.put('/:tid/like', TopicController.updateTopicLike)

// 左侧相同标签下的其它话题
router.get('/:tid/related', TopicController.getRelatedTopicsByTags)

// 楼主的其它话题
router.get('/:uid/popular', TopicController.getPopularTopicsByUserUid)

/*
 * 回复相关
 */

// 发布单个回复
router.post('/:tid/reply', ReplyController.createReply)

// 根据话题 id 获取话题回复
router.get('/:tid/replies', ReplyController.getReplies)

// 更新单个回复
router.put('/:tid/reply', ReplyController.updateReply)

/*
 * 评论相关
 */

// 发布单个评论
router.post('/:tid/comment', CommentController.createComment)

// 获取一个回复下面的所有评论
router.get('/:tid/comment', CommentController.getCommentsByReplyRid)

export default router
