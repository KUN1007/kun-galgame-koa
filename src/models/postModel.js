import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

// 话题 schema 结构
const PostSchema = new mongoose.Schema(
  {
    // 话题的 ID，在创建话题的时候自动生成，从 1 开始
    pid: { type: Number, unique: true },
    // 话题的标题
    title: { type: String, required: true },
    // 话题的内容，富文本
    content: { type: String, required: true },
    // 发帖人的 uid
    uid: { type: Number, required: true, ref: 'user' },
    // 话题的 tag，为一个字符串数组
    tags: { type: Array, required: true },
    // 话题的分类，暂时有一个或两个
    category: { type: Array, required: true },
    // 话题下方回复的 ID，标识了这个话题底下有多少回复
    rid: { type: Array, default: [] },
    // 话题发布的时间
    time: { type: String, default: Date.now },
    // 话题的热度，有专门的热度计算公式
    popularity: { type: Number, default: 0 },
    // 话题的被推数量
    upvotes: { type: Number, default: 0 },
    // 话题被查看的次数
    views: { type: Number, default: 0 },
    // 话题的点赞数
    likes: { type: Number, default: 0 },
    // 话题的回复数
    replies: { type: Number, default: 0 },
    // 话题的分享数
    share: { type: Number, default: 0 },
    // 话题的评论数
    comments: { type: Number, default: 0 },
    // 话题的点踩数
    dislikes: { type: Number, default: 0 },
    // 话题的状态，0 正常，1 封禁, 2 被推
    status: { type: Number, default: 0 },
    // 话题被再次编辑的时间
    edited: { type: String, default: '' },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// 创建虚拟字段 'users'
PostSchema.virtual('user', {
  ref: 'user', // 关联的模型名称
  localField: 'uid', // 当前模型中用于关联的字段
  foreignField: 'uid', // 关联模型中用于关联的字段
})

// pre-save 钩子，在保存文档之前自动递增 upid 字段
PostSchema.pre('save', increasingSequence('pid'))

const PostModel = mongoose.model('post', PostSchema)

export default PostModel
