// 导入更新数据的 schema
import UpdateLogModel from '@/models/updateLogModel'

class UpdateLogController {
  // 创建单条更新数据
  async createUpdateLog(ctx) {
    try {
      const { body } = ctx.request
      const newUpdateLog = new UpdateLogModel(body)
      const savedUpdateLog = await newUpdateLog.save()
      ctx.status = 201
      ctx.body = savedUpdateLog
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to create update log' }
    }
  }

  // 每次返回 5 条历史更新记录，按照时间排序
  async getUpdateLogs(ctx) {
    try {
      const { page, limit } = ctx.query

      // 根据请求参数计算跳过的步幅
      const skip = (parseInt(page) - 1) * limit

      // 根据时间排列好五条数据
      const updateLogs = await UpdateLogModel.find()
        .sort({ upid: -1 })
        .skip(skip)
        .limit(limit)

      // 将数据结构适配为接口定义好的数据结构
      const data = updateLogs.map((log) => ({
        upid: log.upid,
        description: log.description,
        time: log.time,
        version: log.version,
      }))

      // Calculate the total number of pages
      // const totalLogs = await updateLog.countDocuments()
      // const totalPages = Math.ceil(totalLogs / limit)

      ctx.body = {
        code: 200,
        message: 'OK',
        data: data,
      }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch update logs' }
    }
  }

  // 更新单条更新数据
  async updateUpdateLog(ctx) {
    try {
      const { id } = ctx.params // Assuming the UpdateLogModel id is passed as a route parameter
      const { description, version } = ctx.request.body
      const updatedUpdateLog = await UpdateLogModel.findByIdAndUpdate(
        id,
        { description, version },
        { new: true }
      )
      ctx.body = updatedUpdateLog
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to update update log' }
    }
  }

  // 删除单条更新数据
  async deleteUpdateLog(ctx) {
    try {
      const { id } = ctx.params // Assuming the updateLog id is passed as a route parameter
      const deletedUpdateLog = await UpdateLogModel.findByIdAndDelete(id)
      ctx.body = deletedUpdateLog
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to delete update log' }
    }
  }
}

export default new UpdateLogController()
