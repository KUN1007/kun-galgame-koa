import mongoose from 'mongoose'
import env from '@/config/config.dev'

// 遵循 MongoDB 的最新推荐，并确保更好的向后兼容性
mongoose.set('useCreateIndex', true)

// const DB_URL = `mongodb://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@${env.MONGO_HOSTNAME}:${env.MONGO_PORT}/${env.DB_NAME}`
const DB_URL = `mongodb://${env.MONGO_HOSTNAME}:${env.MONGO_PORT}/${env.DB_NAME}`

// 创建连接
mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// 连接成功
mongoose.connection.on('connected', () => {
  console.log(
    `MongoDB: ${config.DB_NAME}, DB_HOST: ${config.MONGO_HOSTNAME} connection successful! `
  )
})

// 连接错误
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err)
})

// 断开连接
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})

export default mongoose
