// 使用 koa 框架
import Koa from 'koa'
// 使用环境变量
import env from '@/config/config.dev'
// 使用 koa-router
import router from '@/routes/routes'
// 解析请求体
import koaBody from 'koa-body'
// 允许跨域请求
import cors from '@koa/cors'
// session
// import session from 'koa-session'
// 解决前端页面刷新 404
// import historyApiFallback from 'koa2-connect-history-api-fallback'
// 鉴权中间件
import { kungalgameAuth } from '@/middleware/authMiddleware'

// 初始化 koa-app
const app = new Koa()

// 使用 koa 跨域请求中间件
app.use(
  cors({
    origin: env.APP_DOMAIN, // 允许的域名
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // 允许携带凭据
  })
)

// 使用 koa-body
app.use(
  koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true,
      maxFieldsSize: 5 * 1024 * 1024,
    },
    onError: (err) => {
      console.log('koa-body TCL: err', err)
    },
  })
)

// 使用 session
// app.keys = [env.APP_SESSION]
// app.use(session(app))

// 鉴权
app.use(kungalgameAuth())
// app.use(historyApiFallback({ index: '' }))
// 使用 koa-router
app.use(router())

app.listen(env.APP_PORT, () => {
  console.log(`server is running on http://${env.APP_HOST}:${env.APP_PORT}`)
})
