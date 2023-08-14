import bcrypt from 'bcrypt'
import { generateToken } from '@/middleware/jwtMiddleware'
import UserModel from '@/models/userModel'
import { setValue } from '@/config/redisConfig' // 导入存储到 Redis 的函数

class UserService {
  /*
   * 接受用户传过来的数据并返回 token
   */

  async loginUser(name, password) {
    // 通过 mongodb 的 $or 运算符检查用户名或邮箱
    const user = await UserModel.findOne({ $or: [{ name }, { email: name }] })

    // 用户不存在
    if (!user) {
      return { code: 404, message: '用户不存在' }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (isPasswordValid) {
      // 验证通过，返回Token数据，这里剩余参数写法可以避免暴露不必要的 user 数据
      // const { password, username, ...userObj } = user.toJSON()
      const token = generateToken({ _id: user._id }, '60m')
      const refreshToken = generateToken({ _id: user._id }, '7d')

      // 存储 token 到 Redis，key 为用户的 uid
      await setValue(`user:${user._id}`, token, 60 * 60) // 存储 60 分钟

      // 规范化成接口定义的数据结构
      return {
        code: 200,
        message: 'OK',
        data: {
          token,
          refreshToken,
        },
      }
    } else {
      return { code: 404, message: '用户名或者密码错误' }
    }
  }

  // 注册逻辑
  async registerUser(name, email, password, ip) {
    const msg = {}
    let check = true

    // 邮箱已被注册，使用 UserModel.countDocuments 会比 UserModel.findOne 效率更好
    const emailCount = await UserModel.countDocuments({ email })
    if (emailCount > 0) {
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

    const usernameCount = await UserModel.countDocuments({
      name: { $regex: new RegExp('^' + name + '$', 'i') },
    })
    if (usernameCount > 0) {
      msg.name = '用户名已经存在，请修改'
      check = false
    }

    // 写入数据到数据库
    if (check) {
      try {
        // bcrypt.hash 的第二个参数为哈希函数的迭代次数，越大加密效果越好但运算越慢
        const hashedPassword = await bcrypt.hash(password, 7)

        // 新建一个 User 数据
        const user = new UserModel({
          name,
          email,
          password: hashedPassword,
          ip,
        })

        const result = await user.save()

        return { code: 200, message: 'OK', data: result }
      } catch (error) {
        return { code: 500, message: '写入数据库出错' }
      }
    } else {
      return { code: 500, message: msg }
    }
  }
}

export default new UserService()
