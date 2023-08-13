import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 收入 schema 结构
const IncomeSchema = new mongoose.Schema(
  {
    iid: { type: Number, unique: true },
    reason: { type: String, default: '' },
    time: { type: String, default: Date.now },
    amount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 iid 字段
IncomeSchema.pre('save', increasingSequence('iid'))

const IncomeModel = mongoose.model('income', IncomeSchema)

export default IncomeModel
