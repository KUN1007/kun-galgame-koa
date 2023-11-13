/**
 * 错误代码与之对应的消息
 */

/**
 * @number {1....}
 * @number {.1...}
 * @number {..1..} - 1 -> userService
 * @number {...1.}
 * @number {....1} - 某个 service 错误的序号，从上到下
 */

// 定义错误码和错误消息的映射
export const errorMessages: Record<number, string> = {
  // User Part
  10101: `User not found`,
  10102: `User password error`,
  10103: `Email verification code error`,
  10104: `Email is already registered`,
  10105: `Username is already registered`,
  10106: `User bio is too long`,
  10107: `Invalid Email, Name, Password, or Verification Code Format`,
  10108: `Invalid password format`,
  10109: `Invalid Email or Verification Code Format`,

  // Topic Part
  10201: `Your daily topic limit has been reached for today.`,
  10202: `Your moemoepoints are less than 1100, so you can't use the topic suggestion feature`,

  // Auth Part
  10301: `Sending emails too frequently`,
  10302: `Invalid Email Format`,
  10303: `Invalid Email, Password, or Verification Code Format`,
}
