import { Context, Middleware } from 'koa'
import { getJWTPayload } from '@/utils/jwt'

// 定义一个正则表达式，匹配白名单路由前缀
const whitelistRegex = /^\/(auth|public|login)/

// 鉴权中间件
export function kungalgameAuth(): Middleware {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      // 获取当前请求的路径
      const path = ctx.request.path

      // 检查请求路径是否匹配白名单正则表达式
      const isWhitelisted = whitelistRegex.test(path)

      // 如果是白名单路由，则跳过鉴权
      if (isWhitelisted) {
        await next()
        return
      }
      // 请求头的 auth
      const authorizationHeader = ctx.headers.authorization

      if (!authorizationHeader) {
        // 如果没有认证头，返回未授权
        ctx.status = 401
        ctx.body = 'Unauthorized'
        return
      }

      // 解码 JWT 令牌
      const decoded = getJWTPayload(authorizationHeader)

      if (!decoded || !decoded.uid) {
        // 如果解码失败或没有 UID，返回未授权
        ctx.status = 401
        ctx.body = 'Unauthorized'
        return
      }

      // 将 UID 存储在 ctx.state 中以供后续中间件或路由使用
      ctx.state.uid = decoded.uid

      // 继续执行下一个中间件或路由处理程序
      await next()
    } catch (error) {
      // 处理其他错误
      console.error('Authentication Error:', error)

      // 返回服务器错误或其他适当的状态码和错误消息
      ctx.status = 500
      ctx.body = 'Internal Server Error'
    }
  }
}
