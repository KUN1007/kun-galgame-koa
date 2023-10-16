import Router from 'koa-router'
import PLController from '@/controller/plController'

const router = new Router()

router.prefix('/balance')

// 获取 income
router.get('/income', PLController.getIncomes)

// 获取 expenditure
router.get('/expenditure', PLController.getExpenditures)

export default router
