/*
 * 用户的 CRUD，定义了一些对用户数据的数据库交互操作
 */

import bcrypt from 'bcrypt'
import { generateToken } from '@/middleware/jwtMiddleware'
import UserModel from '@/models/userModel'
import { setValue } from '@/config/redisConfig' // 导入存储到 Redis 的函数

class UserService {
  // 获取单个用户全部信息
  async getUserByUid(uid: number) {
    const user = await UserModel.findOne({ uid })
    return user
  }

  // 获取用户的部分信息
  /**
   * @param {number} uid - 用户名
   * @param {string[]} fieldsToSelect - 要选择的字段
   */
  async getUserInfoByUid(uid: number, fieldsToSelect: string[]) {
    const userProjection = fieldsToSelect.join(' ')
    const user = await UserModel.findOne({ uid }).select(userProjection)
    return user
  }

  /*
   * 接受用户传过来的数据并返回 token
   */

  async loginUser(name: string, password: string) {
    // 通过 mongodb 的 $or 运算符检查用户名或邮箱
    const user = await UserModel.findOne({ $or: [{ name }, { email: name }] })

    // 用户不存在
    if (!user) {
      return { code: 404, message: 'User not found!' }
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (isValidPassword) {
      // 验证通过，返回Token数据，这里剩余参数写法可以避免暴露不必要的 user 数据
      // 这里用 _id，不用 uid，更安全
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
          uid: user.uid,
          name: user.name,
          avatar: user.avatar,
          token,
          refreshToken,
        },
      }
    } else {
      return { code: 404, message: 'Username or password error!' }
    }
  }

  // 注册逻辑
  async registerUser(
    name: string,
    email: string,
    password: string,
    ip?: string
  ) {
    // 邮箱已被注册，使用 UserModel.countDocuments 会比 UserModel.findOne 效率更好
    const emailCount = await UserModel.countDocuments({ email })
    if (emailCount > 0) {
      return { code: 500, message: '该邮箱已被注册，请修改' }
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
      return { code: 500, message: '用户名已经存在，请修改' }
    }

    // 写入数据到数据库
    // bcrypt.hash 的第二个参数为哈希函数的迭代次数，越大加密效果越好但运算越慢
    const hashedPassword = await bcrypt.hash(password, 7)

    // 新建一个 User 数据
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      ip,
    })

    // 新建用户后自动登陆
    const registeredUser = await user.save()

    // 登陆接口拿到的 token 等数据
    const loginData = (
      await this.loginUser(registeredUser.name, registeredUser.password)
    ).data

    // 返回数据
    return { code: 200, message: 'OK', data: loginData }
  }

  // 更新用户的发帖，回复，评论，点赞，不喜欢，推
  async updateUserArray(uid: number, updateField: string, itemId: number) {
    await UserModel.updateOne(
      { uid: uid },
      { $addToSet: { [updateField]: itemId } }
    )
  }
}

export default new UserService()
