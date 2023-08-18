import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    // 用户 ID，从 1 开始递增且唯一
    uid: { type: Number, unique: true },
    // 用户名，唯一，允许数字字母汉字和 _ ~
    name: { type: String, required: true },
    // 用户邮箱
    email: { type: String, required: true },
    // 用户密码，已加密
    password: { type: String, required: true },
    // 用户的注册 ip，可选
    ip: { type: String, default: '' },
    // 用户头像的图片地址
    avatar: { type: String, default: '' },
    // 用户的角色，普通用户，管理员，超级管理员
    roles: { type: Number, default: 1 },
    // 用户的状态
    status: { type: Number, default: 0 },
    // 用户的注册时间
    time: { type: String, default: Date.now },
    // 用户的萌萌点
    moemoepoint: { type: Number, default: 1007 },
    // 用户的签名
    bio: { type: String, default: '' },
    // 用户的被推数
    upvote: { type: Number, default: 0 },
    // 用户的被赞数
    like: { type: Number, default: 0 },
    // 用户的点踩数
    dislike: { type: Number, default: 0 },
    // 用户的发帖 ID
    topic: { type: Array, default: [] },
    // 用户的回帖 ID
    reply: { type: Array, default: [] },
    // 用户的评论 ID
    comment: { type: Array, default: [] },
    // 用户点赞的帖子 ID
    like_topic: { type: Array, default: [] },
    // 用户推的帖子 ID
    upvote_topic: { type: Array, default: [] },
    // 用户回复的帖子 ID
    reply_topic: { type: Array, default: [] },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 upid 字段
UserSchema.pre('save', increasingSequence('uid'))

const UserModel = mongoose.model('user', UserSchema)

export default UserModel
