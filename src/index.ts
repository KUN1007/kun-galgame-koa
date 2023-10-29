import Koa from 'koa'
import env from '@/config/config.dev'
import router from '@/routes/routes'
import koaBody from 'koa-body'
import cors from '@koa/cors'
import serve from 'koa-static'
import mount from 'koa-mount'
// session
// import session from 'koa-session'
// 解决前端页面刷新 404
import historyApiFallback from 'koa2-connect-history-api-fallback'
// 鉴权中间件
import { kungalgameAuthMiddleware } from '@/middleware/authMiddleware'
// 导入每天的定时任务，重置用户发表话题数量等
import { useKUNGalgameTask } from '@/utils/schedule'
// 错误处理
import { kungalgameErrorHandler } from '@/error/kunErrorHandler'

useKUNGalgameTask()

const app = new Koa()

// 使用 koa 跨域请求中间件
app.use(
  cors({
    origin: env.FRONT_APP_DOMAIN, // 允许的域名
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // 允许携带凭据
  })
)

// 使用 koa-body
app.use(
  koaBody({
    multipart: true,
    formidable: {
      // 临时上传文件夹
      uploadDir: env.TEMP_FILE_PATH,
      keepExtensions: true,
      maxFieldsSize: 1007 * 1024,
    },
    onError: (err) => {
      console.log('koa-body: err', err)
    },
  })
)

// 使用 session
// app.keys = [env.APP_SESSION]
// app.use(session(app))

// 鉴权
app.use(kungalgameAuthMiddleware())
app.use(historyApiFallback({ whiteList: ['/'] }))

// 使用 koa-router
app.use(router())

// 后端静态图片目录
app.use(mount('/uploads', serve('./uploads')))

// 应用发生错误时处理错误
app.on('kunError', kungalgameErrorHandler)

app.listen(env.APP_PORT, () => {
  console.log(`server is running on http://${env.APP_HOST}:${env.APP_PORT}`)
})
