export type SortOrder = 'asc' | 'desc'

export type UserSortFieldRanking =
  | 'moemoepoint'
  | 'upvote'
  | 'like'
  | 'topic'
  | 'reply'
  | 'comment'

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
