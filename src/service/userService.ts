/*
 * 用户的 CRUD，定义了一些对用户数据的数据库交互操作
 */

import bcrypt from 'bcrypt'
import UserModel from '@/models/userModel'
// 导入发送验证码和验证的 Service
import AuthService from './authService'

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
      // 生成 token，需要用户的 uid 和 name
      const { token, refreshToken } = await AuthService.generateTokens(
        user.uid,
        user.name
      )

      // 返回 access token 和必要信息，refreshToken 用于 http only token
      return {
        data: {
          uid: user.uid,
          name: user.name,
          avatar: user.avatar,
          token,
        },
        refreshToken,
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
    code: string,
    ip?: string
  ) {
    // 验证邮箱验证码是否正确且有效
    const isCodeValid = await AuthService.verifyVerificationCode(email, code)
    if (!isCodeValid) {
      return 5001
    }

    // 邮箱已被注册，使用 UserModel.countDocuments 会比 UserModel.findOne 效率更好
    const emailCount = await UserModel.countDocuments({ email })
    if (emailCount > 0) {
      return 5002
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
      return 5003
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
    await user.save()

    // 登陆接口拿到的 token 等数据，这里的 password 是用户传过来的 password
    const loginData = await this.loginUser(name, password)

    // 返回数据
    return loginData
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
