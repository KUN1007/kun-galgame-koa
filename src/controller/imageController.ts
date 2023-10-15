import fs from 'fs'
import path from 'path'
import env from '@/config/config.dev'
// 处理图片的库
// import sharp from 'sharp'

import { Context } from 'koa'
// import UserService from '@/service/userService'
// 操作 cookie 的函数
import { getCookieTokenInfo } from '@/utils/cookies'

// const resizeImage = async (imageData: formidable.File) => {}

class ImageController {
  // 更新用户头像
  async updateUserAvatar(ctx: Context) {
    // 从 cookie 获取用户信息
    const uid = getCookieTokenInfo(ctx).uid
    // 获取头像图片
    const avatarFile = ctx.request.files.avatar

    if (Array.isArray(avatarFile)) {
      return
    }

    // 为文件生成新的唯一文件名，例如使用时间戳
    const newFileName = `${avatarFile.newFilename}_${avatarFile.originalFilename}`

    // 构建新的文件路径
    const newPath = path.resolve(
      __dirname,
      '..',
      '..',
      env.AVATAR_PATH,
      `user_${uid}`
    )

    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath, { recursive: true })
    }

    // 重命名并移动文件到新的路径
    fs.renameSync(avatarFile.filepath, `${newPath}/${newFileName}.webp`)
    ctx.body = 'File uploaded and renamed successfully'

    ctx.body = {
      code: 200,
      message: 'OK',
      data: {},
    }
  }
}

export default new ImageController()
