/*
 * 鉴权服务，用户 jwt 路由接口鉴权
 */
import { verifyJWTPayload, generateToken } from '@/utils/jwt'
import { setValue, getValue } from '@/config/redisConfig'
import nodemailer from 'nodemailer'
import SMPTransport from 'nodemailer-smtp-transport'
import { generateRandomCode } from '@/utils/generateRandomCode'
import env from '@/config/config.dev'

class AuthService {
  // 生成 token
  async generateTokens(uid: number, name: string) {
    const token = generateToken(uid, name, '60m')
    const refreshToken = generateToken(uid, name, '7d')

    // 存储 refresh token 到 Redis，key 为用户的 uid
    await setValue(`refreshToken:${uid}`, refreshToken, 7 * 24 * 60 * 60) // 存储 7 天

    return { token, refreshToken }
  }

  // 根据 refresh token 生成 token
  async generateTokenByRefreshToken(refreshToken: string) {
    try {
      // 将 refreshToken 解码获取用户的 uid
      const decoded = verifyJWTPayload(refreshToken)

      // 没有获取到直接返回
      if (!decoded || !decoded.uid) {
        return null
      }

      // 不是由 kungalgame 签发的萌萌 token
      if (decoded.iss !== 'kungalgame' || decoded.aud !== 'kungalgamer') {
        return null
      }

      // 新生成的 token
      const accessToken = generateToken(decoded.uid, decoded.name, '60m')

      return accessToken
    } catch (error) {
      console.error('Get New Access Token Error:', error)
      return null
    }
  }

  // 发送验证码邮件
  async sendVerificationCodeEmail(email: string) {
    // 生成 7 位随机验证码
    const code = generateRandomCode(7)
    // 存储验证码并设置有效期为10分钟
    await setValue(email, code, 600)

    const transporter = nodemailer.createTransport(
      SMPTransport({
        service: 'gmail',
        auth: {
          user: env.GOOGLE_EMAIL,
          pass: env.GOOGLE_PASSWORD,
        },
      })
    )

    const mailOptions = {
      from: env.GOOGLE_EMAIL,
      to: email,
      subject: '~~~ KUNGalgame ~~~',
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

  // 发送邮箱重置验证码
  async sendResetEmailCode(email: string) {
    // 生成 7 位随机验证码
    const code = generateRandomCode(7)
    // 存储验证码并设置有效期为10分钟
    await setValue(email, code, 600)

    const transporter = nodemailer.createTransport(
      SMPTransport({
        service: 'gmail',
        auth: {
          user: env.GOOGLE_EMAIL,
          pass: env.GOOGLE_PASSWORD,
        },
      })
    )

    const mailOptions = {
      from: env.EMAIL,
      to: email,
      subject: '~~~ KUNGalgame ~~~',
      text: `Your reset email code is: ${code}`,
    }

    return transporter.sendMail(mailOptions)
  }
}

export default new AuthService()
