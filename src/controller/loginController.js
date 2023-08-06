import bcrypt from 'bcrypt'
import generateToken from '@/utils/jsonWebToken'
import UserModel from '@/models/UserModel'

class LoginController {
  // 用户登录
  async login(ctx) {
    // 接收用户的数据
    // 返回token
    const { body } = ctx.request
    // 验证用户账号密码是否正确
    let checkUserPasswd = false
    const user = await UserModel.findOne({ username: body.username })

    if (user === null) {
      ctx.body = {
        code: 404,
        msg: '用户名或者密码错误',
      }
      return
    }

    if (await bcrypt.compare(body.password, user.password)) {
      checkUserPasswd = true
    }

    // mongoDB查库
    if (checkUserPasswd) {
      // 验证通过，返回Token数据
      const userObj = user.toJSON()
      const arr = ['password', 'username']
      arr.map((item) => {
        return delete userObj[item]
      })

      ctx.body = {
        code: 200,
        data: userObj,
        token: generateToken({ _id: user._id }, '60m'),
        refreshToken: generateToken({ _id: user._id }, '7d'),
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
