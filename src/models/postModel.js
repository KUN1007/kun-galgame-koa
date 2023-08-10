import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 帖子 schema 结构
const PostSchema = new mongoose.Schema(
  {
    pid: { type: Number, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    uid: { type: Number, required: true, ref: 'users' },
    tags: { type: [String], required: true },
    category: { type: [String], required: true },
    time: { type: String, default: '' },
    popularity: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    share: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    edited: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// 创建虚拟字段 'users'
PostSchema.virtual('user', {
  ref: 'users', // 关联的模型名称
  localField: 'uid', // 当前模型中用于关联的字段
  foreignField: 'uid', // 关联模型中用于关联的字段
})

// pre-save 钩子，在保存文档之前自动递增 upid 字段
PostSchema.pre('save', increasingSequence('pid'))

const PostModel = mongoose.model('post', PostSchema)

export default PostModel
