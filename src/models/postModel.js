import mongoose from '@/db/connection'

// 帖子 schema 结构
const postSchema = new mongoose.Schema(
  {
    pid: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    floor: { type: Number, required: true },
    html: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: Date, default: Date.now },
    popularity: { type: Number, default: 0 },
    tags: { type: String },
    upvote: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    edited: { type: Date },
    uid: { type: String, required: true },
    category: { type: String, required: true },
    update: { type: Date, default: Date.now },
  },
  { timestamps: { created_at: 'created', updated_at: 'updated' } }
)

const posts = mongoose.model('posts', postSchema)

export default posts
