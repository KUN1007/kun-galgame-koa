import mongoose from '@/db/connection'

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    uid: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    ip: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
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

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
