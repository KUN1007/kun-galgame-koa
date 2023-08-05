import mongoose from '@/db/connection'

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    uid: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    ip: { type: String, required: true, default: '' },
    avatar: { type: String, required: true, default: '' },
    roles: { type: Number, required: true, default: 1 },
    status: { type: Number, required: true, default: 0 },
    time: { type: String, required: true, default: Date.now() },
    moemoepoint: { type: Number, required: true, default: 1007 },
    bio: { type: String, required: true, default: '' },
    upvotes: { type: Number, required: true, default: 0 },
    like: { type: Number, required: true, default: 0 },
    topic: { type: Number, required: true, default: 0 },
    comment: { type: Number, required: true, default: 0 },
    reply: { type: Number, required: true, default: 0 },
    like_topic: { type: Number, required: true, default: 0 },
    upvotes_topic: { type: Number, required: true, default: 0 },
    reply_topic: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

// pre-save 钩子，在保存文档之前自动递增 upid 字段
UserSchema.pre('save', increasingSequence('upid'))

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
