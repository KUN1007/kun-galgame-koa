import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 评论 schema 结构
const CommentSchema = new mongoose.Schema(
  {
    cid: { type: Number, unique: true },
    rid: { type: Number, required: true, ref: 'reply' },
    pid: { type: Number, required: true, ref: 'post' },
    c_uid: { type: Number, required: true, ref: 'user' },
    to_uid: { type: Number, required: true },
    content: { type: String, default: '' },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// 创建虚拟字段 'users'
CommentSchema.virtual('user', {
  ref: 'users', // 关联的模型名称
  localField: 'uid', // 当前模型中用于关联的字段
  foreignField: 'uid', // 关联模型中用于关联的字段
})

// 创建虚拟字段 'post'，用于和帖子关联
ReplySchema.virtual('post', {
  ref: 'posts', // 关联的模型名称
  localField: 'pid', // 当前模型中用于关联的字段
  foreignField: 'pid', // 关联模型中用于关联的字段
})

// pre-save 钩子，在保存文档之前自动递增 cid 字段
CommentSchema.pre('save', increasingSequence('cid'))

const CommentModel = mongoose.model('comment', CommentSchema)

export default CommentModel
