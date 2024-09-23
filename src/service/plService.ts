/**
 * P & L: Profit and Loss Statement
 */
import BalanceModel from '@/models/balance'
import mongoose from '@/db/connection'

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

    const incomeDetails = await BalanceModel.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    const responseData = incomeDetails.map((income) => ({
      bid: income.bid,
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

    const expenditureModelDetails = await BalanceModel.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    const responseData = expenditureModelDetails.map((expenditure) => ({
      bid: expenditure.bid,
      reason: expenditure.reason,
      time: expenditure.time,
      amount: expenditure.amount,
    }))

    return responseData
  }

  // 获取收支总数
  async getPLStatement() {
    // 启动事务
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // 使用聚合操作计算总收入
      const totalIncomeResult = await BalanceModel.aggregate([
        {
          $group: {
            _id: null,
            totalIncome: { $sum: '$amount' },
          },
        },
      ])

      // 使用聚合操作计算总支出
      const totalExpenditureResult = await BalanceModel.aggregate([
        {
          $group: {
            _id: null,
            totalExpenditure: { $sum: '$amount' },
          },
        },
      ])

      // 获取总收入和总支出的值
      const totalIncome: number =
        totalIncomeResult.length > 0 ? totalIncomeResult[0].totalIncome : 0
      const totalExpenditure: number =
        totalExpenditureResult.length > 0
          ? totalExpenditureResult[0].totalExpenditure
          : 0

      // 计算利润与损失
      const profitLoss = totalIncome - totalExpenditure

      // 提交事务
      await session.commitTransaction()
      session.endSession()

      return {
        totalIncome,
        totalExpenditure,
        profitLoss,
      }
    } catch (error) {
      // 如果出现错误，回滚事务
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }
}

export default new PLService()
