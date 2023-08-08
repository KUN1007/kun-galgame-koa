import mongoose from '@/db/connection'
import increasingSequence from '@/utils/increasingSequence'

// 帖子 schema 结构
const PostSchema = new mongoose.Schema(
  {
    pid: { type: Number, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    uid: { type: Number, required: true },
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

// pre-save 钩子，在保存文档之前自动递增 upid 字段
PostSchema.pre('save', increasingSequence('pid'))

const PostModel = mongoose.model('post', PostSchema)

export default PostModel
