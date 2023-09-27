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
}

export default new AuthController()
