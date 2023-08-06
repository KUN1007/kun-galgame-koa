/*
 * redis 的配置文件
 * 该文件对 redis 进行了配置和封装，并对其实例进行了 promisify
 * 这样无需进行回调函数的处理，仅需 async / await 即可
 */

import redis from 'redis'
import { promisifyAll } from 'bluebird'
import env from '@/config/config.dev'

const options = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  no_ready_check: true,
  detect_buffers: true,
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 7) {
      console.log('already tried 7 times!')
      return undefined
    }
    return Math.min(options.attempt * 100, 3000)
  },
}

// 创建单个 redis 客户端实例并 promisify
const client = promisifyAll(redis.createClient(options))

client.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

// 创建值
const setValue = async (key, value, time) => {
  if (typeof value === 'undefined' || value == null || value === '') {
    return
  }

  if (typeof value === 'string') {
    try {
      if (typeof time !== 'undefined') {
        await client.setAsync(key, value, 'EX', time)
      } else {
        await client.setAsync(key, value)
      }
    } catch (err) {
      console.error('client.set -> err', err)
    }
  } else if (typeof value === 'object') {
    // Handle object values if needed
  }
}

// 获取值
const getValue = async (key) => {
  try {
    return await client.getAsync(key)
  } catch (err) {
    console.error('client.getAsync -> err', err)
    return null
  }
}

// 获取全部值
const getHValue = (key) => {
  // 这里由于将之前的 client promisify 了，所以不能使用 hgetall
  return client.hgetallAsync(key)
}

// 删除值
const delValue = (key) => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log('delete successfully')
    } else {
      console.log('delete redis key error:' + err)
    }
  })
}

export { client, setValue, getValue, getHValue, delValue }
