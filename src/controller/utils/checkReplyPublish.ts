export const checkReplyPublish = (tags: string[], content: string) => {
  if (tags.length > 7) {
    return 10501
  }

  // 检查单个 tag 的长度是否超过 17
  for (const tag of tags) {
    if (tag.length > 17) {
      return 10502
    }
  }

  // 检查 content 是否为空
  if (!content.trim()) {
    return 10503
  }

  // 检查 content 的长度是否超过 10007
  if (content.length > 10007) {
    return 10504
  }

  return 0
}
