import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

import { UserAttributes } from './model'

const UserSchema = new mongoose.Schema<UserAttributes>(
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
    time: { type: Number, default: Date.now() },
    // 用户的萌萌点
    moemoepoint: { type: Number, default: 1007 },
    // 用户的签名
    bio: { type: String, default: '' },
    // 用户的被推数
    upvote: { type: Number, default: 0 },
    // 用户的被赞数
    like: { type: Number, default: 0 },
    // 用户的被踩数
    dislike: { type: Number, default: 0 },
    // 用户今日发表的话题，每日发布上限 萌萌点 / 10 个，12 点重置
    // 由于是重置属性，使用三个单词命名
    daily_topic_count: { type: Number, default: 0 },

    // 用户的好友
    friend: { type: [Number], default: [] },
    // 用户关注的用户
    followed: { type: [Number], default: [] },
    // 关注用户的用户
    follower: { type: [Number], default: [] },
    // 用户发表的话题 ID
    topic: { type: [String], default: [] },
    // 用户发表的回复 ID
    reply: { type: [String], default: [] },
    // 用户发表的评论 ID
    comment: { type: [String], default: [] },
    // 用户点赞的话题 ID
    like_topic: { type: [String], default: [] },
    // 用户点踩的话题 ID
    dislike_topic: { type: [String], default: [] },
    // 用户推的话题 ID
    upvote_topic: { type: [String], default: [] },
    // 用户回复的话题 ID
    reply_topic: { type: [String], default: [] },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 utid 字段
UserSchema.pre('save', increasingSequence('uid'))

const UserModel = mongoose.model<UserAttributes>('user', UserSchema)

export default UserModel
