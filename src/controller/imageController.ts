import fs from 'fs'
import path from 'path'
import env from '@/config/config.dev'
// 处理图片的库
import sharp from 'sharp'

import { Context } from 'koa'
// import UserService from '@/service/userService'
// 操作 cookie 的函数
import { getCookieTokenInfo } from '@/utils/cookies'

function clearUserFolder(userFolderPath: string) {
  if (fs.existsSync(userFolderPath)) {
    fs.readdirSync(userFolderPath).forEach((file) => {
      const filePath = path.join(userFolderPath, file)
      // 如果是文件，直接删除
      fs.unlinkSync(filePath)
    })
  }
}

const resizedUserAvatar = async (ctx: Context) => {
  // 从 cookie 获取用户信息
  const uid = getCookieTokenInfo(ctx).uid
  // 获取头像图片
  const avatarFile = ctx.request.files.avatar

  if (Array.isArray(avatarFile)) {
    return
  }

  // 为文件生成新的唯一文件名，例如使用时间戳
  const newFileName = `${
    avatarFile.originalFilename
  }-${Date.now()}-kun-galgame-avatar`

  // 构建新的文件路径
  const newPath = path.resolve(
    __dirname,
    '..',
    '..',
    env.AVATAR_PATH,
    `user_${uid}`
  )

  // 清空用户文件夹
  clearUserFolder(newPath)

  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath, { recursive: true })
  }

  const originalFilePath = path.join(newPath, `${newFileName}.webp`)
  const resizedFilePath = path.join(newPath, `${newFileName}-100x100.webp`)

  // 移动文件并重命名
  fs.renameSync(avatarFile.filepath, originalFilePath)

  // 使用Sharp库调整图像大小为100x100像素并保存
  await sharp(originalFilePath)
    // 背景透明
    .resize(100, 100, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toFile(resizedFilePath)
}

class ImageController {
  // 更新用户头像
  async updateUserAvatar(ctx: Context) {
    await resizedUserAvatar(ctx)
  }
}

export default new ImageController()
