import schedule from 'node-schedule'

import UserModel from '@/models/userModel'

// 创建每日 0 点的定时任务
const resetDailyTopicCountJTask = schedule.scheduleJob(
  '0 0 * * *',
  async () => {
    try {
      // 在这里执行重置操作，例如将用户模型的 daily_topic_count 设置为 0
      await UserModel.updateMany({}, { $set: { daily_topic_count: 0 } })
      console.log('每日重置用户的 daily_topic_count 完成')
    } catch (error) {
      console.error('重置用户 daily_topic_count 时出错：', error)
    }
  }
)

export const useKUNGalgameTask = () => {
  resetDailyTopicCountJTask
}
