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

    // TODO: 后端再次校验，以防万一
    if (bio.length > 107) {
      return
    }

    await UserService.updateUserBio(uid, bio)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  // 获取用户邮箱
  async getUserEmail(ctx: Context) {
    // 从 cookie 获取用户信息
    const uid = getCookieTokenInfo(ctx).uid
    const email = await UserService.getUserEmail(uid)

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {
        email: email,
      },
    }
  }

  // 更新用户邮箱
  async updateUserEmail(ctx: Context) {
    // 从 cookie 获取用户信息
    const uid = getCookieTokenInfo(ctx).uid

    const { email, code } = ctx.request.body

    const result = await UserService.updateUserEmail(uid, email, code)

    // 返回错误码
    if (typeof result === 'number') {
      ctx.app.emit('kunError', result, ctx)
      return
    }

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  // 更新用户密码
  async updateUserPassword(ctx: Context) {
    // 从 cookie 获取用户信息
    const uid = getCookieTokenInfo(ctx).uid

    const { oldPassword, newPassword } = ctx.request.body

    const result = await UserService.updateUserPassword(
      uid,
      oldPassword,
      newPassword
    )

    // 返回错误码
    if (typeof result === 'number') {
      ctx.app.emit('kunError', result, ctx)
      return
    }

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }

  // 获取用户话题，发布的，点赞的，推的
  async getUserTopics(ctx: Context) {
    const tidArray = ctx.query.tidArray as string

    // 数组为空返回空
    if (!tidArray) {
      ctx.body = {
        code: 200,
        message: 'OK',
        data: [],
      }
      return
    }

    const numberArray = tidArray.split(',').map((tid) => parseInt(tid))
    const result = await UserService.getUserTopics(numberArray)
    ctx.body = {
      code: 200,
      message: 'OK',
      data: result,
    }
  }

  // 获取用户回复
  async getUserReplies(ctx: Context) {
    const ridArray = ctx.query.ridArray as string

    // 数组为空返回空
    if (!ridArray) {
      ctx.body = {
        code: 200,
        message: 'OK',
        data: [],
      }
      return
    }

    const numberArray = ridArray.split(',').map((rid) => parseInt(rid))
    const result = await UserService.getUserReplies(numberArray)
    ctx.body = {
      code: 200,
      message: 'OK',
      data: result,
    }
  }
}

export default new UserController()
