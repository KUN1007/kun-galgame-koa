import { Context } from 'koa'
import AuthService from '@/service/authService'

class AuthController {
  // 发送验证码
  async sendVerificationCodeEmail(ctx: Context) {
    const email: string = ctx.request.body.email

    if (!email) {
      ctx.status = 400
      ctx.body = { code: 400, message: 'Email is required' }
      return
    }

    try {
      await AuthService.sendVerificationCodeEmail(email)
      ctx.status = 200
      ctx.body = { code: 200, message: 'Verification code sent successfully' }
    } catch (error) {
      ctx.status = 500
      ctx.body = { code: 500, message: 'Failed to send verification code' }
    }
  }

  // 根据 refresh token 获取 access token
  async generateTokenByRefreshToken(ctx: Context) {
    // refreshToken 就存在 ctx.cookies 中，每次请求都会发送
    const refreshToken = ctx.cookies.get('kungalgame-moemoe-refresh-token')

    try {
      const newToken = await AuthService.generateTokenByRefreshToken(
        refreshToken
      )
      ctx.status = 200
      ctx.body = {
        code: 200,
        message: 'Token refresh successfully',
        data: {
          token: newToken,
        },
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: 'Failed to generate refresh token',
      }
    }
  }

  // 发送重置邮箱验证码
  async sendResetEmailCode(ctx: Context) {
    const email: string = ctx.request.body.email

    await AuthService.sendResetEmailCode(email)

    ctx.body = {
      code: 200,
      message: 'Verification code sent successfully',
      data: {},
    }
  }

  // 重置密码,这里的重置密码需要验证邮箱
  async resetPasswordByEmail(ctx: Context) {
    const { email, code, newPassword } = ctx.request.body

    const result = await AuthService.resetPasswordByEmail(
      email,
      code,
      newPassword
    )

    // 返回错误码
    if (typeof result === 'number') {
      ctx.app.emit('kunError', result, ctx)
      return
    }

    ctx.body = {
      code: 200,
      message: 'Reset password successfully!',
      data: {},
    }
  }
}

export default new AuthController()
