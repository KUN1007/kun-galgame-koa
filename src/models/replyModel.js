import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 回帖 schema 结构
const ReplySchema = new mongoose.Schema(
  {
    // 回复的 ID，从 1 开始且唯一，自动生成
    rid: { type: Number, unique: true },
    // 回复所属帖子的 ID，标志了该条回复是属于哪个帖子的
    pid: { type: Number, required: true, ref: 'post' },
    // 回复人的 uid，标识了这个回帖是谁发的
    r_uid: { type: Number, required: true, ref: 'users' },
    // 被回复人的 uid，标志了这个回帖是回给谁的
    to_uid: { type: Number, required: true },
    // 回复的楼层数，标志了这个回复属于该帖子的几楼
    floor: { type: Number, default: 0 },
    // 回复的 tag，可选，字符串数组
    tags: { type: [String], default: [] },
    // 回复被再次编辑的时间
    edited: { type: String, default: '' },
    // 回帖的内容
    content: { type: String, default: '' },
    // 回帖是否被推
    upvotes: { type: Number, default: 0 },
    // 回帖的点赞数
    likes: { type: Number, default: 0 },
    // 回帖的点踩数
    dislikes: { type: Number, default: 0 },
    // 回帖的分享数
    share: { type: Number, default: 0 },
    // 回帖的评论数
    comment: { type: Number, default: 0 },
    // 回帖的评论 id
    cid: { type: [Number], default: [] },
  },
  // 时间戳，自动创建
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 upid 字段
ReplySchema.pre('save', increasingSequence('rid'))

const ReplyModel = mongoose.model('reply', ReplySchema)

export default ReplyModel
