import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 标签 schema 结构
const TagSchema = new mongoose.Schema(
  {
    // 单个 tag 的 ID，从 1 开始自动递增且唯一
    tag_id: { type: Number, unique: true },
    // tag 所在的话题或者回帖的 id
    pid: { type: Number, require: true },
    // tag 所在的回帖 id，为 0 的就是楼主话题的 tag
    rid: { type: Number, default: 0 },
    // tag 的名字
    name: { type: String, require: true },
    // tag 所属话题的分类
    category: { type: String, default: '' },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// 创建复合唯一索引，不允许同时重复，但是可以单独重复
// 例如重复的 pid，不同的 name，或者重复的 name，不同的 pid
TagSchema.index({ pid: 1, rid: 1, name: 1 }, { unique: true })

// pre-save 钩子，在保存文档之前自动递增 upid 字段
TagSchema.pre('save', increasingSequence('tag_id'))

const TagModel = mongoose.model('tag', TagSchema)

export default TagModel
