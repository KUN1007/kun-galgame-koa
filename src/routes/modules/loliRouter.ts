import Router from 'koa-router'
import LoliController from '@/controller/loliController'

const router = new Router()

router.prefix('/loli')

router.get('/image', LoliController.getLoli)

export default router