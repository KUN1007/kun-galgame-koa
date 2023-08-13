import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 不萌记录 schema 结构
const NonMoeSchema = new mongoose.Schema(
  {
    nid: { type: Number, unique: true },
    uid: { type: Number, required: true },
    description: { type: String, required: true },
    time: { type: String, default: Date.now },
    result: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 nid 字段
NonMoeSchema.pre('save', increasingSequence('nid'))

const NonMoeModel = mongoose.model('NonMoe', NonMoeSchema)

export default NonMoeModel
