/*
 * 鉴权服务，用户 jwt 路由接口鉴权
 */

import { generateToken } from '@/middleware/jwtMiddleware'
import { setValue, getValue } from '@/config/redisConfig'
import nodemailer from 'nodemailer'
import { generateRandomCode } from '@/utils/generateRandomCode'

class AuthService {
  async generateTokens(uid: number) {
    const token = generateToken({ _id: uid }, '60m')
    const refreshToken = generateToken({ _id: uid }, '7d')

    // 存储 refresh token 到 Redis，key 为用户的 uid
    await setValue(`refreshToken:${uid}`, refreshToken, 7 * 24 * 60 * 60) // 存储 7 天

    return { token, refreshToken }
  }

  // 发送验证码邮件
  async sendVerificationCodeEmail(email: string) {
    // 生成 7 位随机验证码
    const code = generateRandomCode(7)
    // 存储验证码并设置有效期为10分钟
    await setValue(email, code, 600)

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'kungalgame@gmail.com',
        pass: 'XXXXXXXXXXXXXXXXXXXXX',
      },
    })

    const mailOptions = {
      from: 'kungalgame@gmail.com',
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`,
    }

    return transporter.sendMail(mailOptions)
  }

  // 验证验证码
  async verifyVerificationCode(
    email: string,
    userProvidedCode: string
  ): Promise<boolean> {
    // 从存储中获取验证码
    const storedCode = await getValue(email)

    if (!storedCode) {
      // 没有存储的验证码，或者已过期
      return false
    }

    // 检查用户提供的验证码是否与存储的验证码匹配
    return userProvidedCode === storedCode
  }
}

export default new AuthService()
