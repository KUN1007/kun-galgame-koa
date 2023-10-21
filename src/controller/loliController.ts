/**
 * 啊哈哈哈，我就是要写个 loli controller，来打我呀 ~
 */

import { Context } from 'koa'
import { getLoli } from '@/utils/loli'

class LoliController {
  // 获取一只 loli
  async getLoli(ctx: Context) {
    const loliData = getLoli()
    ctx.body = {
      code: 200,
      message: 'OK',
      data: loliData,
    }
  }
}

export default new LoliController()
