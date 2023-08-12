import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 帖子 schema 结构
const ReplySchema = new mongoose.Schema(
  {
    rid: { type: Number, unique: true },
    pid: { type: Number, required: true, ref: 'post' },
    r_uid: { type: Number, required: true, ref: 'users' },
    to_tid: { type: Number, required: true },
    floor: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    edited: { type: String, default: '' },
    content: { type: String, default: '' },
    upvotes: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    share: { type: Number, default: 0 },
    comment: { type: Number, default: 0 },
    cid: { type: [Number], default: [] },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// 创建虚拟字段 'users'，用于和用户关联
ReplySchema.virtual('user', {
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

// pre-save 钩子，在保存文档之前自动递增 upid 字段
ReplySchema.pre('save', increasingSequence('rid'))

const ReplyModel = mongoose.model('reply', ReplySchema)

export default ReplyModel
