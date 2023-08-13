import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 标签 schema 结构
const TagSchema = new mongoose.Schema(
  {
    // 单个 tag 的 ID，从 1 开始自动递增且唯一
    tag_id: { type: Number, unique: true },
    // tag 的名字
    name: { type: String, default: '' },
    // tag 被使用的总次数
    count: { type: Number, default: 0 },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 upid 字段
TagSchema.pre('save', increasingSequence('tag_id'))

const TagModel = mongoose.model('tag', TagSchema)

export default TagModel
