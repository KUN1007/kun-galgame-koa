import { Context } from 'koa'
import UpdateLogService from '@/service/updateLogService'

class UpdateLogController {
  async createUpdateLog(ctx: Context) {
    try {
      const { body } = ctx.request
      const savedUpdateLog = await UpdateLogService.createUpdateLog(body)
      ctx.status = 201
      ctx.body = savedUpdateLog
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to create update log' }
    }
  }

  async getUpdateLogs(ctx: Context) {
    try {
      const page = parseInt(ctx.query.page as string)
      const limit = parseInt(ctx.query.limit as string)
      const data = await UpdateLogService.getUpdateLogs(page, limit)
      ctx.body = { code: 200, message: 'OK', data: data }
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to fetch update logs' }
    }
  }

  async updateUpdateLog(ctx: Context) {
    try {
      const { id } = ctx.params
      const { description, version } = ctx.request.body
      const updatedUpdateLog = await UpdateLogService.updateUpdateLog(
        id,
        description,
        version
      )
      ctx.body = updatedUpdateLog
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to update update log' }
    }
  }

  async deleteUpdateLog(ctx: Context) {
    try {
      const { id } = ctx.params
      const deletedUpdateLog = await UpdateLogService.deleteUpdateLog(id)
      ctx.body = deletedUpdateLog
    } catch (error) {
      ctx.status = 500
      ctx.body = { error: 'Failed to delete update log' }
    }
  }
}

export default new UpdateLogController()
