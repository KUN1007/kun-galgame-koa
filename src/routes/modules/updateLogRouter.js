import Router from 'koa-router'
import UpdateLogController from '@/controller/updateLogController'

const router = new Router()

router.prefix('/update')

router.post('/logs', UpdateLogController.createUpdateLog)

router.get('/logs', UpdateLogController.getUpdateLogs)

router.put('/logs/:id', UpdateLogController.updateUpdateLog)

router.delete('/logs/:id', UpdateLogController.deleteUpdateLog)

export default router
