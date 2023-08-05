import bcrypt from 'bcrypt'
import User from '@/models/User'

class LoginController {
  // 注册接口
  async register(ctx) {
    // 接收客户端的数据
    const { body } = ctx.request
    let msg = {}

    let check = true
    // 邮箱已被注册
    const email = await User.findOne({ username: body.username })
    if (email !== null && typeof email.username !== 'undefined') {
      msg.username = '此邮箱已经注册，可以通过邮箱找回密码'
      check = false
    }

    const username = await User.findOne({ name: body.name })
    // 用户名已被注册
    if (username !== null && typeof username.name !== 'undefined') {
      msg.name = '此昵称已经被注册，请修改'
      check = false
    }

    // 写入数据到数据库
    if (check) {
      body.password = await bcrypt.hash(body.password, 7)
      const user = new User({
        username: body.username,
        name: body.name,
        password: body.password,
      })
      const result = await user.save()
      ctx.body = {
        code: 200,
        data: result,
        msg: '注册成功',
      }
      return
    }
    ctx.body = {
      code: 500,
      msg,
    }
  }
}

export default new LoginController()
