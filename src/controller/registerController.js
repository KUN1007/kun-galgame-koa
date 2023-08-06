import bcrypt from 'bcrypt'
import UserModel from '@/models/userModel'

class RegisterController {
  // 注册接口
  async register(ctx) {
    // 接收客户端的数据
    const { body } = ctx.request
    let msg = {}

    console.log(ctx.request.body.email)

    let check = true
    // 邮箱已被注册
    const email = await UserModel.findOne({ email: body.email })
    if (email !== null) {
      msg.email = '该邮箱已被注册，请修改'
      check = false
    }

    /*
     * 正则表达式
     * 这里的逻辑是在对单个 mongodb 的数据字段查找时，添加了 i 标志来实现不区分大小写的查询
     * 这样可以保证把 mongodb 中存储的数据不区分大小写和 body.name 进行比较
     * 预期实现的效果是：
     * 已注册 `kun` 则 `KUN` 会显示已占用
     * 但是如果注册时注册为 `KUN` 则数据库中也保存的是 `KUN` 而不是 `kun`
     */

    const username = await UserModel.findOne({
      name: { $regex: new RegExp('^' + body.name + '$', 'i') },
    })

    // 用户名已被注册
    if (username !== null) {
      msg.name = '用户名已经存在，请修改'
      check = false
    }

    // 写入数据到数据库
    if (check) {
      // bcrypt.hash 的第二个参数为哈希函数，越复杂加密效果越好
      body.password = await bcrypt.hash(body.password, 7)

      // 新建一个 User 数据
      const user = new UserModel({
        // 写入数据库时名字区分大小写
        name: body.name,
        email: body.email,
        password: body.password,
        ip: body.ip,
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
      message: msg,
    }
  }
}

export default new RegisterController()
