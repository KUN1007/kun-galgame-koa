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

enum ErrorCode {
  UserNotFound = 10101,
  UserPasswordError = 10102,
  EmailVerificationCodeError = 10103,
  EmailAlreadyRegistered = 10104, // 新的错误码：邮箱已被注册错误
  UsernameAlreadyRegistered = 10105, // 新的错误码：用户名已被注册错误
  // ...
}

// 定义错误码和错误消息的映射
export const errorMessages: Record<number, string> = {
  [ErrorCode.UserNotFound]: 'User not found',
  [ErrorCode.UserPasswordError]: 'User password error',
  [ErrorCode.EmailVerificationCodeError]: 'Email verification code error',
  [ErrorCode.EmailAlreadyRegistered]: 'Email is already registered',
  [ErrorCode.UsernameAlreadyRegistered]: 'Username is already registered',
}
