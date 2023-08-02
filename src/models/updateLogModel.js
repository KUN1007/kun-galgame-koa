import mongoose from '@/db/connection'

// 更新日志 schema 结构
const updateLogSchema = new mongoose.Schema({
  // 单个更新日志的 id，唯一，从 1 递增
  upid: { type: Number, unique: true },
  description: { type: String, required: true, default: '' },
  time: { type: Date, required: false, default: Date.now },
  version: { type: String, required: false, default: '' },
})

// pre-save 钩子，在保存文档之前自动递增 upid 字段
updateLogSchema.pre('save', async function (next) {
  const doc = this
  if (!doc.isNew) {
    return next()
  }

  try {
    const lastPost = await doc.constructor
      .findOne({}, { upid: 1 })
      .sort({ upid: -1 })
    if (lastPost) {
      doc.upid = lastPost.upid + 1
    } else {
      doc.upid = 1
    }
    next()
  } catch (error) {
    return next(error)
  }
})

const updateLog = mongoose.model('updateLog', updateLogSchema)

export default updateLog
