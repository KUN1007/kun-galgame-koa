import Router from 'koa-router'
import UpdateLogController from '@/controller/updateLogController'

const router = new Router()

router.post('/updateLogs', UpdateLogController.createUpdateLog)

router.get('/updateLogs', UpdateLogController.getUpdateLogs)

router.put('/updateLogs/:id', UpdateLogController.updateUpdateLog)

router.delete('/updateLogs/:id', UpdateLogController.deleteUpdateLog)

export default router
