import bcrypt from 'bcrypt'
import UserModel from '@/models/userModel'

class LoginController {
  // 注册接口
  async register(ctx) {
    // 接收客户端的数据
    const { body } = ctx.request
    let msg = {}

    let check = true
    // 邮箱已被注册
    const email = await UserModel.findOne({ email: body.email })
    if (email !== null && typeof email.email !== 'undefined') {
      msg.email = '此邮箱已经注册'
      check = false
    }

    const username = await UserModel.findOne({ name: body.name })
    // 用户名已被注册
    if (username !== null && typeof username.name !== 'undefined') {
      msg.name = '此昵称已经被注册，请修改'
      check = false
    }

    // 写入数据到数据库
    if (check) {
      // bcrypt.hash 的第二个参数为哈希函数，越复杂加密效果越好
      body.password = await bcrypt.hash(body.password, 7)

      // 新建一个 User 数据
      const user = new UserModel({
        username: body.username,
        name: body.name,
        password: body.password,
      })

      const result = await user.save()

      console.log(result)

      ctx.body = {
        code: 200,
        message: 'OK',
        data: result,
      }
      return
    }

    // 上面执行出错
    ctx.body = {
      code: 500,
      msg,
    }
  }
}

export default new LoginController()
