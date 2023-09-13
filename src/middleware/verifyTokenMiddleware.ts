import env from '@/config/config.dev'
import jwt from 'jsonwebtoken'
import { Context } from 'koa'
// import { getJWTPayload, generateToken } from '@/middleware/jwtMiddleware'

const verifyTokenMiddleware = async (ctx: Context, next?: any) => {
  const authorizationHeader = ctx.headers.authorization

  if (authorizationHeader) {
    const token = authorizationHeader.split(' ')[1]

    try {
      const payload = jwt.verify(token, env.JWT_SECRET)
      ctx.state.user = payload // 将用户信息保存到上下文的 state 中
      await next()
    } catch (error) {
      ctx.status = 401
      ctx.body = { error: 'Invalid token' }
    }
  } else {
    ctx.status = 401
    ctx.body = { error: 'Missing token' }
  }
}

module.exports = verifyTokenMiddleware
