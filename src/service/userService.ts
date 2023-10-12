/*
 * 用户的 CRUD，定义了一些对用户数据的数据库交互操作
 */

import bcrypt from 'bcrypt'
import UserModel from '@/models/userModel'
// 导入发送验证码和验证的 Service
import AuthService from './authService'
import mongoose from '@/db/connection'
import type {
  UpdateFieldArray,
  UpdateFieldNumber,
  LoginResponseData,
} from './types/userService'

// 用户可供更新的字符串型字段名
type UpdateFieldString = 'avatar' | 'bio'

class UserService {
  // 获取单个用户全部信息
  async getUserByUid(uid: number) {
    const user = await UserModel.findOne({ uid })
    const responseData = {
      uid: user.uid,
      name: user.name,
      avatar: user.avatar,
      roles: user.roles,
      status: user.status,
      time: user.time,
      moemoepoint: user.moemoepoint,
      bio: user.bio,
      upvote: user.upvote,
      like: user.like,
      dislike: user.dislike,
      daily_topic_count: user.daily_topic_count,

      topic: user.topic,
      reply: user.reply,
      comment: user.comment,
    }
    return responseData
  }

  // 更新用户的签名
  async updateUserBio(uid: number, bio: string) {
    await UserModel.updateOne({ uid }, { $set: { bio: bio } })
  }

  // 获取用户邮箱
  async getUserEmail(uid: number) {
    const user = await UserModel.findOne({ uid })
    return user.email
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

  async loginUser(
    name: string,
    password: string
  ): Promise<number | LoginResponseData> {
    // 通过 mongodb 的 $or 运算符检查用户名或邮箱
    const user = await UserModel.findOne({ $or: [{ name }, { email: name }] })

    // 用户不存在
    if (!user) {
      return 10101
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password)

    // 密码错误
    if (isCorrectPassword) {
      // 生成 token，需要用户的 uid 和 name
      const { token, refreshToken } = await AuthService.generateTokens(
        user.uid,
        user.name
      )

      // 返回 access token 和必要信息，refreshToken 用于 http only token
      const userInfo = {
        uid: user.uid,
        name: user.name,
        avatar: user.avatar,
        moemoepoint: user.moemoepoint,
        roles: user.roles,
        token,
      }

      return {
        data: userInfo,
        refreshToken,
      }
    } else {
      // 密码错误
      return 10102
    }
  }

  // 注册逻辑
  async registerUser(
    name: string,
    email: string,
    password: string,
    code: string,
    ip?: string
  ): Promise<number | LoginResponseData> {
    // 验证邮箱验证码是否正确且有效
    const isCodeValid = await AuthService.verifyVerificationCode(email, code)
    if (!isCodeValid) {
      // 邮箱验证码错误
      return 10103
    }

    // 邮箱已被注册，使用 UserModel.countDocuments 会比 UserModel.findOne 效率更好
    const emailCount = await UserModel.countDocuments({ email })
    if (emailCount > 0) {
      // 邮箱已被注册错误
      return 10104
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
      // 用户名已被注册错误
      return 10105
    }

    // 启动事务
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
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

      // 提交事务
      await session.commitTransaction()
      session.endSession()

      // 返回数据
      return loginData
    } catch (error) {
      // 如果出现错误，回滚事务
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }

  // 更新用户的数值型字段，萌萌点，被推数，被赞数，被踩数，amount 可以是负数
  async updateUserNumber(
    uid: number,
    updateFieldNumber: UpdateFieldNumber,
    amount: number
  ) {
    await UserModel.updateOne(
      { uid: uid },
      { $inc: { [updateFieldNumber]: amount } }
    )
  }

  // 更新用户的发帖，回复，评论，点赞，不喜欢，推
  /**
   * @param {number} uid - 用户 uid
   * @param {UpdateField} updateFieldArray - 要更新用户 Model 的哪个字段
   * @param {number} itemId - model 的 id 字段
   * @param {boolean} isPush - 移除还是 push，用于撤销点赞等操作
   */
  async updateUserArray(
    uid: number,
    updateFieldArray: UpdateFieldArray,
    itemId: number,
    isPush: boolean
  ) {
    if (isPush) {
      await UserModel.updateOne(
        { uid: uid },
        { $addToSet: { [updateFieldArray]: itemId } }
      )
    } else {
      await UserModel.updateOne(
        { uid: uid },
        { $pull: { [updateFieldArray]: itemId } }
      )
    }
  }

  // 更新用户的其它信息，头像，签名等，都为字符串
  /**
   * @param {number} uid - 用户 uid
   * @param {UpdateFieldString} updateFieldString - 要更新用户 Model 的哪个字段
   * @param {string} newValue - 新签名或头像的值
   */
  async updateUserInfo(
    uid: number,
    updateFieldString: UpdateFieldString,
    newValue: string
  ) {
    await UserModel.updateOne(
      { uid: uid },
      { $set: { [updateFieldString]: newValue } }
    )
  }
}

export default new UserService()
