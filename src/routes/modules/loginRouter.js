import Router from 'koa-router'
import LoginController from '@/controller/loginController'

const router = new Router()

router.prefix('/login')

// 注册用户
router.post('/', LoginController.login)

export default router
