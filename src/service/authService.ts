/*
 * 鉴权服务，用户 jwt 路由接口鉴权
 */

import { generateToken } from '@/middleware/jwtMiddleware'
import { setValue } from '@/config/redisConfig'

class AuthService {
  async generateTokens(uid: number) {
    const token = generateToken({ _id: uid }, '60m')
    const refreshToken = generateToken({ _id: uid }, '7d')

    // 存储 refresh token 到 Redis，key 为用户的 uid
    await setValue(`refreshToken:${uid}`, refreshToken, 7 * 24 * 60 * 60) // 存储 7 天

    return { token, refreshToken }
  }

  // ... 其他方法 ...
}

export default new AuthService()
