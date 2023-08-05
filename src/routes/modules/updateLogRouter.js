import Router from 'koa-router'
import UpdateLogController from '@/controller/updateLogController'

const router = new Router()

router.prefix('/update')

router.post('/history', UpdateLogController.createUpdateLog)

router.get('/history', UpdateLogController.getUpdateLogs)

router.put('/history/:id', UpdateLogController.updateUpdateLog)

router.delete('/history/:id', UpdateLogController.deleteUpdateLog)

export default router
