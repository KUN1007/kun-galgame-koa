import mongoose from '@/db/connection'
import increasingSequence from '@/middleware/increasingSequenceMiddleware'

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    uid: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    ip: { type: String, default: '' },
    avatar: { type: String, default: '' },
    roles: { type: Number, default: 1 },
    status: { type: Number, default: 0 },
    time: { type: String, default: Date.now },
    moemoepoint: { type: Number, default: 1007 },
    bio: { type: String, default: '' },
    upvotes: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    topic: { type: Number, default: 0 },
    comment: { type: Number, default: 0 },
    reply: { type: Number, default: 0 },
    like_topic: { type: Number, default: 0 },
    upvotes_topic: { type: Number, default: 0 },
    reply_topic: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 upid 字段
UserSchema.pre('save', increasingSequence('uid'))

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
