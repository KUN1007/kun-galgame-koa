import fs from 'fs'
import path from 'path'
import env from '@/config/config.dev'

// 读取 JSON 文件数据
import loliData from '../../uploads/image/ren/ren.json'

/* 随机数 */
import { randomNum } from './random'

export const getLoli = () => {
  // 构建新的文件路径
  const loliPath = path.resolve(__dirname, '..', '..', env.LOLI_PATH)
  // 获取本地图片文件
  const getAssetsFile = (name: number) => path.join(loliPath, `${name}.webp`)

  /* 随机汗水 ？ */
  // const randomSweat = randomNum(0, 1)
  /* 随机眉毛 */
  const randomBrow = randomNum(1, 18)

  /* 随机眼睛 */
  const randomEye = randomNum(19, 36)

  /* 随机嘴巴 */
  const randomMouth = randomNum(37, 56)

  /* 随机腮红 */
  const randomFace = randomNum(57, 62)

  /* 随机衣服 */
  const randomSkirt = randomNum(63, 70)

  // 定义一个 loli 对象
  const loli = {
    lass: loliData[randomSkirt],
    eye: loliData[randomEye],
    brow: loliData[randomBrow],
    mouth: loliData[randomMouth],
    face: loliData[randomFace],
  }

  // 身体定位
  const loliBodyLeft = loli.lass.left + 'px'
  const loliBodyTop = loli.lass.top + 'px'

  // 眼睛定位
  const loliEyeLeft = loli.eye.left + 'px'
  const loliEyeTop = loli.eye.top + 'px'

  // 眉毛定位
  const loliBrowLeft = loli.brow.left + 'px'
  const loliBrowTop = loli.brow.top + 'px'

  // 嘴巴定位
  const loliMouthLeft = loli.mouth.left + 'px'
  const loliMouthTop = loli.mouth.top + 'px'

  // 腮红定位
  const loliFaceLeft = loli.face.left + 'px'
  const loliFaceTop = loli.face.top + 'px'

  // 身体的图片资源链接
  const body = fs.readFileSync(getAssetsFile(loli.lass.layer_id))

  // 眼睛的图片资源链接
  const eye = fs.readFileSync(getAssetsFile(loli.eye.layer_id))

  // 眉毛的图片资源链接
  const brow = fs.readFileSync(getAssetsFile(loli.brow.layer_id))

  // 嘴巴的图片资源链接
  const mouth = fs.readFileSync(getAssetsFile(loli.mouth.layer_id))

  // 腮红的图片资源链接
  const face = fs.readFileSync(getAssetsFile(loli.face.layer_id))

  // 导出模块
  return {
    loliBodyLeft,
    loliBodyTop,
    loliEyeLeft,
    loliEyeTop,
    loliBrowLeft,
    loliBrowTop,
    loliMouthLeft,
    loliMouthTop,
    loliFaceLeft,
    loliFaceTop,

    body,
    eye,
    brow,
    mouth,
    face,
  }
}
