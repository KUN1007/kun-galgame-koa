/*
 * 评论的 CRUD，定义了一些对评论数据的数据库交互操作
 */

import CommentModel from '@/models/commentModel'
import ReplyService from './replyService'
import UserService from './userService'

class CommentService {
  // 创建一条评论
  async createComment(
    rid: number,
    tid: number,
    c_uid: number,
    to_uid: number,
    content: string
  ) {
    const newComment = new CommentModel({
      rid,
      tid,
      c_uid,
      to_uid,
      content,
    })

    // 保存好的评论
    const savedComment = await newComment.save()

    // 评论人
    const c_user = await UserService.getUserInfoByUid(savedComment.c_uid, [
      'uid',
      'avatar',
      'name',
    ])

    // 被评论人
    const to_user = await UserService.getUserInfoByUid(savedComment.to_uid, [
      'uid',
      'name',
    ])

    // 在用户的回复数组里保存回复
    await UserService.updateUserArray(c_uid, 'comment', savedComment.cid)

    // 更新回复的评论数组
    await ReplyService.addCommentToReply(rid, savedComment.cid)

    return {
      rid: savedComment.rid,
      tid: savedComment.tid,
      c_user: c_user,
      to_user: to_user,
      content: savedComment.content,
      likes: savedComment.likes,
      dislikes: savedComment.dislikes,
    }
  }

  // 删除一条评论
  async deleteComment(rid: number, cid: number) {
    const deletedComment = await CommentModel.findOneAndDelete({ cid }).lean()

    // 更新回复的评论数组
    await ReplyService.removeCommentFromReply(rid, cid)

    return deletedComment
  }

  async updateComment(cid: number, content: string) {
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
  async getCommentsByReplyRid(rid: number) {
    const comment = await CommentModel.find({ rid })
      .populate('cuid', 'uid avatar name')
      .populate('touid', 'uid name')
      .lean()

    // 返回回复下评论的所有数据
    const replyComments = comment.map((comment) => ({
      rid: comment.rid,
      tid: comment.tid,
      c_user: {
        uid: comment.cuid[0].uid,
        avatar: comment.cuid[0].avatar,
        name: comment.cuid[0].name,
      },
      to_user: {
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
