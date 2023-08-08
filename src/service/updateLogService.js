import UpdateLogModel from '@/models/updateLogModel'

class UpdateLogService {
  // 创建单条更新数据
  async createUpdateLog(updateLogData) {
    try {
      const newUpdateLog = new UpdateLogModel(updateLogData)
      const savedUpdateLog = await newUpdateLog.save()
      return savedUpdateLog
    } catch (error) {
      throw new Error('Failed to create update log')
    }
  }

  // 每次返回 5 条历史更新记录，按照时间排序
  async getUpdateLogs(page, limit) {
    try {
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

      return data
    } catch (error) {
      throw new Error('Failed to fetch update logs')
    }
  }

  // 更新单条更新数据
  async updateUpdateLog(id, description, version) {
    try {
      const updatedUpdateLog = await UpdateLogModel.findByIdAndUpdate(
        id,
        { description, version },
        { new: true }
      )
      return updatedUpdateLog
    } catch (error) {
      throw new Error('Failed to update update log')
    }
  }

  // 删除单条更新数据
  async deleteUpdateLog(id) {
    try {
      const deletedUpdateLog = await UpdateLogModel.findByIdAndDelete(id)
      return deletedUpdateLog
    } catch (error) {
      throw new Error('Failed to delete update log')
    }
  }
}

export default new UpdateLogService()
