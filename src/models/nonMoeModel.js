import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 不萌记录 schema 结构
const NonMoeSchema = new mongoose.Schema(
  {
    // 不萌记录的 ID，从 1 开始，在创建记录的时候自动生成
    nid: { type: Number, unique: true },
    // 用户 ID，这条记录是对谁的记录
    uid: { type: Number, required: true },
    // 不萌记录的描述，发生了什么不萌行为
    description: { type: String, required: true },
    // 不萌记录发生的时间
    time: { type: String, default: Date.now },
    // 发生不萌行为的后果
    result: { type: String, required: true },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 nid 字段
NonMoeSchema.pre('save', increasingSequence('nid'))

const NonMoeModel = mongoose.model('NonMoe', NonMoeSchema)

export default NonMoeModel
