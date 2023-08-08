import UserService from '@/service/userService'

class UserController {
  // 登录
  async login(ctx) {
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
  async register(ctx) {
    try {
      const { name, email, password, ip } = ctx.request.body

      const result = await UserService.registerUser(name, email, password, ip)

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
