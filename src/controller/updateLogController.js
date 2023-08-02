import updateLog from '@/models/updateLogModel'

class UpdateLogController {
  async createUpdateLog(ctx) {
    try {
      console.log(ctx.request.body)
      const { upid, description, time, version } = ctx.request.body
      const newUpdateLog = new updateLog({ upid, description, time, version })
      const savedUpdateLog = await newUpdateLog.save()
      ctx.status = 201
      ctx.body = savedUpdateLog
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to create update log' }
    }
  }

  async getUpdateLogs(ctx) {
    try {
      const updateLogs = await updateLog.find().sort({ time: -1 })
      ctx.body = updateLogs
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch update logs' }
    }
  }
  async updateUpdateLog(ctx) {
    try {
      const { id } = ctx.params // Assuming the updateLog id is passed as a route parameter
      const { description, version } = ctx.request.body
      const updatedUpdateLog = await updateLog.findByIdAndUpdate(
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

  async deleteUpdateLog(ctx) {
    try {
      const { id } = ctx.params // Assuming the updateLog id is passed as a route parameter
      const deletedUpdateLog = await updateLog.findByIdAndDelete(id)
      ctx.body = deletedUpdateLog
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to delete update log' }
    }
  }
}

export default new UpdateLogController()
