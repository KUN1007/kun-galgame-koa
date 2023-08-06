import bcrypt from 'bcrypt'
import generateToken from '@/utils/jsonWebToken'
import UserModel from '@/models/UserModel'

class LoginController {
  /*
   * 接受用户传过来的数据并返回 token
   */

  async login(ctx) {
    const { name, password } = ctx.request.body

    // 通过 mongodb 的 $or 运算符检查用户名或邮箱
    const user = await UserModel.findOne({ $or: [{ name }, { email: name }] })

    // 用户不存在
    if (!user) {
      ctx.body = {
        code: 404,
        message: '用户不存在',
      }
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (isPasswordValid) {
      // 验证通过，返回Token数据
      const { password, username, ...userObj } = user.toJSON()
      const token = generateToken({ _id: user._id }, '60m')
      const refreshToken = generateToken({ _id: user._id }, '7d')

      ctx.body = {
        code: 200,
        data: userObj,
        token,
        refreshToken,
      }
    } else {
      // 用户名 密码验证失败，返回提示
      ctx.body = {
        code: 404,
        msg: '用户名或者密码错误',
      }
    }
  }
}

export default new LoginController()
