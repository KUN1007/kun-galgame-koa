/**
 * P & L: Profit and Loss Statement
 */
import IncomeModel from '@/models/incomeModel'
import ExpenditureModel from '@/models/expenditureModel'

type SortField = 'time' | 'amount'
type SortOrder = 'asc' | 'desc'

class PLService {
  // 获取 income 的接口，分页获取，懒加载，每次 3 条
  /**
   * @param {number} page - 分页的页数，第几页
   * @param {number} limit - 分页中每页有多少条信息
   * @param {SortField} sortField - 根据哪个字段进行排序
   * @param {SortOrder} sortOrder - 升序还是降序，`asc`, `desc`
   */
  async getIncomes(
    page: number,
    limit: number,
    sortField: SortField,
    sortOrder: SortOrder
  ) {
    const skip = (page - 1) * limit

    const sortOptions: Record<string, 'asc' | 'desc'> = {
      [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
    }

    const incomeDetails = await IncomeModel.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    const responseData = incomeDetails.map((income) => ({
      iid: income.iid,
      reason: income.reason,
      time: income.time,
      amount: income.amount,
    }))

    return responseData
  }

  // 获取 Expenditure 的接口，分页获取，懒加载，每次 3 条
  /**
   * @param {number} page - 分页的页数，第几页
   * @param {number} limit - 分页中每页有多少条信息
   * @param {SortField} sortField - 根据哪个字段进行排序
   * @param {SortOrder} sortOrder - 升序还是降序，`asc`, `desc`
   */
  async getExpenditures(
    page: number,
    limit: number,
    sortField: SortField,
    sortOrder: SortOrder
  ) {
    const skip = (page - 1) * limit

    const sortOptions: Record<string, 'asc' | 'desc'> = {
      [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
    }

    const expenditureModelDetails = await ExpenditureModel.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    const responseData = expenditureModelDetails.map((expenditure) => ({
      eid: expenditure.eid,
      reason: expenditure.reason,
      time: expenditure.time,
      amount: expenditure.amount,
    }))

    return responseData
  }
}

export default new PLService()
