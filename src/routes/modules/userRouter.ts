import Router from 'koa-router'
import UserController from '@/controller/userController'

const router = new Router()

router.prefix('/user')

// 注册
router.post('/register', UserController.register)

// 登录
router.post('/login', UserController.login)

// 获取单个用户信息
router.get('/:uid', UserController.getUserByUid)

// 更新用户签名
router.put('/:uid/bio', UserController.updateUserBio)

// 获取用户邮箱
router.get('/:uid/email', UserController.getUserEmail)

// 更新用户邮箱
router.put('/:uid/email', UserController.updateUserEmail)

export default router
