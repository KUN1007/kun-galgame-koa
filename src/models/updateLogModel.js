import mongoose from '@/db/connection'
import increasingSequence from '@/utils/increasingSequence'

// 更新日志 schema 结构
const UpdateLogSchema = new mongoose.Schema(
  {
    // 单个更新日志的 id，唯一，从 1 递增
    upid: { type: Number, unique: true },
    description: { type: String, required: true, default: '' },
    time: { type: Date, required: false, default: Date.now },
    version: { type: String, required: false, default: '' },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 upid 字段
UpdateLogSchema.pre('save', increasingSequence('upid'))

const UpdateLogModel = mongoose.model('updateLog', UpdateLogSchema)

export default UpdateLogModel
