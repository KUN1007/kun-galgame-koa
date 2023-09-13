import Router from 'koa-router'
import LoginController from '@/controller/loginController'

const router = new Router()

router.prefix('/login')

// 注册
router.post('/register', LoginController.register)

// 登录
router.post('/login', LoginController.login)

export default router
