// 使用 koa 框架
import Koa from 'koa'
// 使用环境变量
import env from '@/config/config.dev'
// 使用 koa-router
import router from '@/routes/routes'
// 解析请求体
import bodyParser from 'koa-bodyparser'

// 初始化 koa-app
const app = new Koa()

// 使用 koa-router
app.use(bodyParser())
app.use(router())

app.listen(env.APP_PORT, () => {
  console.log(`server is running on http://localhost:${env.APP_PORT}`)
})
