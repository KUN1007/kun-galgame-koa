import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 支出 schema 结构
const ExpenditureSchema = new mongoose.Schema(
  {
    eid: { type: Number, unique: true },
    reason: { type: String, default: '' },
    time: { type: String, default: Date.now },
    amount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 eid 字段
ExpenditureSchema.pre('save', increasingSequence('eid'))

const ExpenditureModel = mongoose.model('expenditure', ExpenditureSchema)

export default ExpenditureModel
