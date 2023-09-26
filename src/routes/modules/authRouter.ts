import Router from 'koa-router'
import AuthController from '@/controller/authController'

const router = new Router()

router.prefix('/auth')

// 发送验证码
router.post('/email/code', AuthController.sendVerificationCodeEmail)

// 根据 refresh token 获取 token
router.post('/token/refresh', AuthController.generateTokenByRefreshToken)

export default router
