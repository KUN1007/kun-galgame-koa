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

// 初始化 koa-app
const app = new Koa()

// 使用 koa 跨域请求中间件
app.use(cors())
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
// 使用 koa-router
app.use(router())

app.listen(env.APP_PORT, () => {
  console.log(`server is running on http://${env.APP_HOST}:${env.APP_PORT}`)
})
