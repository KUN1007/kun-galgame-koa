import Router from 'koa-router'
import AuthController from '@/controller/authController'

const router = new Router()

router.prefix('/auth')

// 发送验证码
router.post('/email/send', AuthController.sendVerificationCodeEmail)

export default router
