import jwt from 'jsonwebtoken'
import env from '@/config/config.dev'

const getJWTPayload = (token) => {
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
}

// 生成 token 返回给客户端
const generateToken = (payload, expire = '7h') => {
  if (payload) {
    return jwt.sign(
      {
        ...payload,
      },
      env.JWT_SECRET,
      { expiresIn: expire }
    )
  } else {
    throw new Error('生成token错误')
  }
}

export { getJWTPayload, generateToken }
