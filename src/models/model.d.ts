// 定义 Comment 文档的接口类型
export interface CommentAttributes {
  cid: number
  rid: number
  tid: number
  c_uid: number
  to_uid: number
  content: string

  likes_count: number
  dislikes_count: number

  likes: number[]
  dislikes: number[]
  // 虚拟字段
  cuid: UserAttributes[]
  touid: UserAttributes[]
}

// 支出
interface ExpenditureAttributes {
  eid: number
  reason: string
  time: number
  amount: number
}

// 收入
interface IncomeAttributes {
  iid: number
  reason: string
  time: number
  amount: number
}

// 不萌记录
interface NonMoeAttributes {
  nid: number
  uid: number
  description: string
  time: number
  result: string
}

// 回复
interface ReplyAttributes {
  rid: number
  tid: number
  r_uid: number
  to_uid: number
  floor: number
  to_floor: number
  tags: string[]
  time: number
  edited: string
  content: string
  upvote_time: number

  upvotes_count: number
  likes_count: number
  dislikes_count: number
  share_count: number
  comment_count: number

  upvotes: number[]
  likes: number[]
  dislikes: number[]
  share: number[]
  comment: number[]
  // 虚拟字段
  r_user: UserAttributes[]
  to_user: UserAttributes[]
}

// 标签
interface TagAttributes {
  tag_id: number
  tid: number
  rid: number
  name: string
  category: string[]
}

// 话题
interface TopicAttributes {
  tid: number
  title: string
  content: string
  uid: number
  tags: string[]
  category: string[]
  time: number

  popularity: number
  views: number
  upvote_time: number

  upvotes_count: number
  replies_count: number
  likes_count: number
  share_count: number
  dislikes_count: number

  upvotes: number[]
  replies: number[]
  likes: number[]
  share: number[]
  comments: number
  dislikes: number[]

  status: number
  edited: number
  // 虚拟字段
  user: UserAttributes[]
}

// 更新日志
interface UpdateLogAttributes {
  upid: number
  description: string
  time: number
  version: string
}

// 用户
interface UserAttributes {
  uid: number
  name: string
  email: string
  password: string
  ip: string
  avatar: string
  roles: number
  status: number
  time: number
  moemoepoint: number
  bio: string
  upvote: number
  like: number
  dislike: number
  daily_topic_count: number

  friend_count: number
  followed_count: number
  follower_count: number
  topic_count: number
  reply_count: number
  comment_count: number
  like_topic_count: number
  dislike_topic_count: number
  upvote_topic_count: number
  reply_topic_count: number

  friend: number[]
  followed: number[]
  follower: number[]
  topic: number[]
  reply: number[]
  comment: number[]
  like_topic: number[]
  dislike_topic: number[]
  upvote_topic: number[]
  reply_topic: number[]
}
