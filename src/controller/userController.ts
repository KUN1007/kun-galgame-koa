import { Context } from 'koa'
import UserService from '@/service/userService'
import { setCookieRefreshToken, getCookieTokenInfo } from '@/utils/cookies'

class UserController {
  // 登录
  async login(ctx: Context) {
    const { name, password } = ctx.request.body

    const result = await UserService.loginUser(name, password)

    // 返回错误码
    if (typeof result === 'number') {
      ctx.app.emit('kunError', result, ctx)
      return
    }

    // 将 refresh token 设置到 cookie
    setCookieRefreshToken(ctx, result.refreshToken)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: result.data,
    }
  }

  // 注册
  async register(ctx: Context) {
    const { name, email, password, code } = ctx.request.body
    const ip = ctx.request.ip
    const result = await UserService.registerUser(
      name,
      email,
      password,
      code,
      ip
    )
    // 返回错误码
    if (typeof result === 'number') {
      ctx.app.emit('kunError', result, ctx)
      return
    }

    // 将 refresh token 设置到 cookie
    setCookieRefreshToken(ctx, result.refreshToken)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: result.data,
    }
  }

  // 获取单个用户信息
  async getUserByUid(ctx: Context) {
    const uid = parseInt(ctx.params.uid as string)
    const user = await UserService.getUserByUid(uid)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: user,
    }
  }

  // 更新用户签名
  async updateUserBio(ctx: Context) {
    // 从 cookie 获取用户信息
    const uid = getCookieTokenInfo(ctx).uid

    const bio = ctx.request.body.bio as string

    await UserService.updateUserBio(uid, bio)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }
}

export default new UserController()
