import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 标签 schema 结构
const TagSchema = new mongoose.Schema(
  {
    tag_id: { type: Number, unique: true },
    name: { type: String, default: '' },
    count: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 upid 字段
TagSchema.pre('save', increasingSequence('tag_id'))

const TagModel = mongoose.model('tag', TagSchema)

export default TagModel
