// 用户可供更新的数组型字段名
export type UpdateFieldArray =
  | 'friend'
  | 'followed'
  | 'follower'
  | 'topic'
  | 'reply'
  | 'comment'
  | 'like_topic'
  | 'dislike_topic'
  | 'upvote_topic'
  | 'reply_topic'

// 用户可供更新的数值型字段名
export type UpdateFieldNumber =
  | 'moemoepoint'
  | 'upvote'
  | 'like'
  | 'dislike'
  | 'daily_topic_count'

interface LoginUserResponseData {
  uid: number
  name: string
  avatar: string
  token: string
}

export interface LoginResponseData {
  data: LoginUserResponseData
  refreshToken: string
}
