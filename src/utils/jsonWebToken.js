import jwt from 'jsonwebtoken'
import env from '@/config/config.dev'

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

export default generateToken
