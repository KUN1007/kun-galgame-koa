import UserService from '@/service/userService'

class UserController {
  async login(ctx) {
    const { name, password } = ctx.request.body

    const result = await UserService.loginUser(name, password)

    ctx.body = result
  }

  async register(ctx) {
    const { name, email, password, ip } = ctx.request.body

    const result = await UserService.registerUser(name, email, password, ip)

    ctx.body = result
  }
}

export default new UserController()
