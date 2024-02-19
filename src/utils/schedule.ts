import schedule from 'node-schedule'

import UserModel from '@/models/userModel'

// 创建每日 0 点的定时任务
const resetDailyTopicCountTask = schedule.scheduleJob('0 0 * * *', async () => {
  try {
    // 在这里执行重置操作
    await UserModel.updateMany(
      {},
      {
        $set: { daily_topic_count: 0, daily_image_count: 0, daily_check_in: 0 },
      }
    )
    console.log('Reset user daily count successfully!')
  } catch (error) {
    console.error('Reset user daily count ERROR: ', error)
  }
})

export const useKUNGalgameTask = () => {
  resetDailyTopicCountTask
}
