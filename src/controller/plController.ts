/**
 * P & L: Profit and Loss Statement
 */

import { Context } from 'koa'
import PLService from '@/service/plService'

type SortField = 'time' | 'amount'
type SortOrder = 'asc' | 'desc'

class TagController {
  // 获取 income 数据
  async getIncomes(ctx: Context) {
    const page = parseInt(ctx.query.page as string)
    const limit = parseInt(ctx.query.limit as string)
    const sortField = ctx.query.sortField as SortField
    const sortOrder = ctx.query.sortOrder as SortOrder

    const incomes = await PLService.getIncomes(
      page,
      limit,
      sortField,
      sortOrder
    )
    ctx.body = {
      code: 200,
      message: 'OK',
      data: incomes,
    }
  }

  // 获取 expenditure 数据
  async getExpenditures(ctx: Context) {
    const page = parseInt(ctx.query.page as string)
    const limit = parseInt(ctx.query.limit as string)
    const sortField = ctx.query.sortField as SortField
    const sortOrder = ctx.query.sortOrder as SortOrder

    const expenditures = await PLService.getExpenditures(
      page,
      limit,
      sortField,
      sortOrder
    )
    ctx.body = {
      code: 200,
      message: 'OK',
      data: expenditures,
    }
  }
}

export default new TagController()
