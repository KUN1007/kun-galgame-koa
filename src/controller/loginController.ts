import { Context } from 'koa'
import UserService from '@/service/userService'
import { setCookieRefreshToken } from '@/utils/cookies'

class UserController {
  // 登录
  async login(ctx: Context) {
    try {
      const { name, password } = ctx.request.body

      const result = await UserService.loginUser(name, password)

      // 将 refresh token 设置到 cookie
      setCookieRefreshToken(ctx, result.refreshToken)

      ctx.body = {
        code: 200,
        message: 'OK',
        data: result.data,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        error: 'An error occurred while processing the login request',
      }
    }
  }

  // 注册
  async register(ctx: Context) {
    try {
      const { name, email, password, code } = ctx.request.body
      const ip = ctx.request.ip

      const result = await UserService.registerUser(
        name,
        email,
        password,
        code,
        ip
      )

      // 邮箱验证码错误
      if (result === 5001) {
        ctx.body = {
          code: 500,
          message: 'Email verification code error',
        }
        return
      }

      // 邮箱已被注册
      if (result === 5002) {
        ctx.body = {
          code: 500,
          message: 'Email already registered, please modify',
        }
        return
      }

      if (result === 5003) {
        ctx.body = {
          code: 500,
          message: 'Username already registered, please modify',
        }
        return
      }

      // 将 refresh token 设置到 cookie
      setCookieRefreshToken(ctx, result.refreshToken)

      ctx.body = {
        code: 200,
        message: 'OK',
        data: result.data,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: 'An error occurred while processing the registration request',
      }
    }
  }
}

export default new UserController()
