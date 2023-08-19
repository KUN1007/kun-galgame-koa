/*
 * 评论的 CRUD，定义了一些对评论数据的数据库交互操作
 */

import CommentModel from '@/models/commentModel'
import ReplyService from './replyService'
import UserService from './userService'

class CommentService {
  // 创建一条评论
  async createComment(rid, tid, c_uid, to_uid, content) {
    const newComment = new CommentModel({
      rid,
      tid,
      c_uid,
      to_uid,
      content,
    })

    const savedComment = await newComment.save()

    // 在用户的回复数组里保存回复
    await UserService.updateUserArray(c_uid, 'comment', savedComment.cid)

    // 更新回复的评论数组
    await ReplyService.addCommentToReply(rid, savedComment.cid)

    return savedComment
  }

  // 删除一条评论
  async deleteComment(rid, cid) {
    const deletedComment = await CommentModel.findOneAndDelete({ cid }).lean()

    // 更新回复的评论数组
    await ReplyService.removeCommentFromReply(rid, cid)

    return deletedComment
  }

  async updateComment(cid, content) {
    try {
      const updatedComment = await CommentModel.findOneAndUpdate(
        { cid },
        { $set: { content, edited: new Date().toISOString() } },
        { new: true }
      ).lean()

      return updatedComment
    } catch (error) {
      console.error('Failed to update comment:', error)
      throw new Error('Failed to update comment')
    }
  }

  // 根据回复的 rid 获取回复的所有评论
  async getCommentsByReplyRid(rid) {
    const comment = await CommentModel.find({ rid })
      .populate('cuid', 'uid avatar name')
      .populate('touid', 'uid name')
      .lean()

    // 返回回复下评论的所有数据
    const replyComments = comment.map((comment) => ({
      rid: comment.rid,
      tid: comment.tid,
      c_uid: {
        uid: comment.cuid[0].uid,
        avatar: comment.cuid[0].avatar,
        name: comment.cuid[0].name,
      },
      to_uid: {
        uid: comment.touid[0].uid,
        name: comment.touid[0].name,
      },
      content: comment.content,
      likes: comment.likes,
      dislikes: comment.dislikes,
    }))

    return replyComments
  }
}

export default new CommentService()
