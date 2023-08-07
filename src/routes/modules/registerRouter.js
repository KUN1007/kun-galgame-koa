import Router from 'koa-router'
import RegisterController from '@/controller/login/registerController'

const router = new Router()

router.prefix('/register')

// 注册用户
router.post('/', RegisterController.register)

export default router
