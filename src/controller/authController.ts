import { Context } from 'koa'
import AuthService from '@/service/authService'

// 发送验证码的响应
type SendVerificationCodeEmailResponse = KUNGalgameResponseData<{}>

// 验证验证码的响应
type VerifyVerificationCodeResponse = KUNGalgameResponseData<{}>

// 验证验证码的请求体
interface VerifyVerificationCodeBody {
  email: string
  code: string
}

class AuthController {
  // 发送验证码
  async sendVerificationCodeEmail(
    ctx: Context
  ): Promise<SendVerificationCodeEmailResponse> {
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
      console.error(error)
    }
  }

  // 验证验证码
  async verifyVerificationCode(
    ctx: Context
  ): Promise<VerifyVerificationCodeResponse> {
    const { email, code } = ctx.request.body as VerifyVerificationCodeBody

    if (!email || !code) {
      ctx.status = 400
      ctx.body = { code: 400, message: 'Email and code are required' }
      return
    }

    const isCodeValid = await AuthService.verifyVerificationCode(email, code)

    if (isCodeValid) {
      ctx.status = 200
      ctx.body = { code: 200, message: 'Verification code is valid' }
    } else {
      ctx.status = 400
      ctx.body = { code: 400, message: 'Invalid verification code' }
    }
  }
}

export default new AuthController()
