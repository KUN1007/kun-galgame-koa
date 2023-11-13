export const checkTopicPublish = (
  title: string,
  content: string,
  tags: string[],
  category: string[]
) => {
  if (!title.trim() || title.trim().length > 40) {
    return 10304
  }

  if (!content.trim() || content.trim().length > 100007) {
    return 10305
  }

  if (!tags.length || tags.length > 7) {
    return 10306
  }

  if (!category.length || category.length > 2) {
    return 10307
  }

  return 0
}
