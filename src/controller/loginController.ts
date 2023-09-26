import { Context } from 'koa'
import UserService from '@/service/userService'

class UserController {
  // 登录
  async login(ctx: Context) {
    try {
      const { name, password } = ctx.request.body

      const result = await UserService.loginUser(name, password)

      // 设置刷新 token，有效期 7 天
      ctx.cookies.set('kungalgame-moemoe-refresh-token', result.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

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

      // 设置 httpOnly Cookie，仅限 refresh
      ctx.cookies.set('authToken', result.refreshToken, { httpOnly: true })

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
