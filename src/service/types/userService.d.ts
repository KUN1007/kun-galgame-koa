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
