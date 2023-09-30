/*
 * 评论的 CRUD，定义了一些对评论数据的数据库交互操作
 */

import CommentModel from '@/models/commentModel'
import ReplyService from './replyService'
import UserService from './userService'

// 回复可供更新的字段名
type UpdateField = 'likes' | 'dislikes'

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

    // 在用户的回复数组里保存回复，这里只是保存，没有撤销操作，所以是 true
    await UserService.updateUserArray(c_uid, 'comment', savedComment.cid, true)

    // 更新回复的评论数组
    await ReplyService.updateReplyArray(rid, 'cid', savedComment.cid, true)

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

  // 更新回复数组，用于推，点赞，点踩，分享等
  /**
   * @param {number} cid - 回复 id
   * @param {UpdateField} updateField - 要更新回复 Model 的哪个字段
   * @param {number} uid - 要将哪个用户的 uid push 进回复对应的数组里
   * @param {boolean} isPush - 移除还是 push，用于撤销点赞等操作
   */
  async updateCommentArray(
    cid: number,
    updateField: UpdateField,
    uid: number,
    isPush: boolean
  ) {
    if (isPush) {
      await CommentModel.updateOne(
        { cid: cid },
        { $addToSet: { [updateField]: uid } }
      )
    } else {
      await CommentModel.updateOne(
        { cid: cid },
        { $pull: { [updateField]: uid } }
      )
    }
  }
}

export default new CommentService()
