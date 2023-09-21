import { Context } from 'koa'
import UserService from '@/service/userService'

class UserController {
  // 登录
  async login(ctx: Context) {
    try {
      const { name, password } = ctx.request.body

      const result = await UserService.loginUser(name, password)

      ctx.body = result
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

      ctx.body = result
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        error: 'An error occurred while processing the registration request',
      }
    }
  }
}

export default new UserController()
