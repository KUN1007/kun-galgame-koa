import jwt from 'jsonwebtoken'
import env from '@/config/config.dev'

interface Payload {
  // 定义 payload 的属性
  // 例如：id: string;
  // username: string;
  // 等等...
}

const getJWTPayload = (token: string) => {
  return jwt.verify(token.split(' ')[1], env.JWT_SECRET)
}

// 生成 token 返回给客户端
const generateToken = (payload: Payload, expire = '7h') => {
  if (payload) {
    return jwt.sign(
      {
        ...payload,
      },
      env.JWT_SECRET,
      { expiresIn: expire }
    )
  } else {
    throw new Error('Generate Token error')
  }
}

export { getJWTPayload, generateToken }
