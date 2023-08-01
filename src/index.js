import Koa from 'koa'
import env from '@/config/config.dev'

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'KUN IS CUTEST!'
})

app.listen(env.APP_PORT, () => {
  console.log(`server is running on http://localhost:${env.APP_PORT}`)
})
