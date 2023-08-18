import CommentModel from '@/models/commentModel'
import ReplyModel from '@/models/replyModel'

class CommentService {
  // 创建一条评论
  async createComment(rid, pid, c_uid, to_uid, content) {
    const newComment = new CommentModel({
      rid,
      pid,
      c_uid,
      to_uid,
      content,
    })

    const savedComment = await newComment.save()

    // 更新回帖的评论数组
    await ReplyModel.updateOne({ rid }, { $push: { cid: savedComment.cid } })

    return savedComment
  }

  // 删除一条评论
  async deleteComment(cid, rid) {
    const deletedComment = await CommentModel.findOneAndDelete({ cid }).lean()

    // 更新回帖的评论数组
    await ReplyModel.updateOne({ rid }, { $pull: { cid } })

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

  // 根据回帖的 rid 获取回帖的所有评论
  async getCommentsByReplyRid(rid) {
    const comment = await CommentModel.find({ rid })
      .populate('cuid', 'uid avatar name')
      .populate('touid', 'uid name')
      .lean()

    // 返回回帖下评论的所有数据
    const replyComments = comment.map((comment) => ({
      rid: comment.rid,
      pid: comment.pid,
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
