import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 评论 schema 结构
const CommentSchema = new mongoose.Schema(
  {
    // 评论的 ID，从 1 开始且要求唯一，在用户发评论时自动增加
    cid: { type: Number, unique: true },
    // 评论所属的回复 ID，标识了这个评论是属于哪个回复的
    rid: { type: Number, required: true, ref: 'reply' },
    // 评论所属的帖子 ID，标识了这个评论是哪个帖子底下的
    pid: { type: Number, required: true, ref: 'post' },
    // 评论者的 uid，和用户关联，标识了这是谁发的评论
    c_uid: { type: Number, required: true, ref: 'user' },
    // 被评论者的 uid，和用户关联，标识了这个评论是发给谁的
    to_uid: { type: Number, required: true },
    // 评论的内容，纯文字，无富文本
    content: { type: String, default: '' },
    // 评论的点赞数
    likes: { type: Number, default: 0 },
    // 评论的点踩数
    dislikes: { type: Number, default: 0 },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 cid 字段
CommentSchema.pre('save', increasingSequence('cid'))

const CommentModel = mongoose.model('comment', CommentSchema)

export default CommentModel
