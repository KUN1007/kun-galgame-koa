import mongoose from '@/db/connection'

// 更新日志 schema 结构
const updateLogSchema = new mongoose.Schema(
  {
    // 单个更新日志的 id，唯一，从 1 递增
    upid: { type: Number, unique: true },
    description: { type: String, required: true, default: '' },
    time: { type: Date, required: false, default: Date.now },
    version: { type: String, required: false, default: '' },
  },
  { timestamps: { created_at: 'created', updated_at: 'updated' } }
)

const updateLog = mongoose.model('updateLog', updateLogSchema)

export default updateLog
