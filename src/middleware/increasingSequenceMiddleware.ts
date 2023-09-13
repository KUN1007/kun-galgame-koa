import { Document } from 'mongoose'

/**
 * Generic function to generate an increasing sequence for a given model and field.
 * @param {String} fieldName - The name of the field to be incremented.
 * @param {Number} startSeq - The starting sequence number.
 * @returns {Function} - A pre-save middleware function to be used in the schema.
 */
type PreSaveMiddleware<T extends Document> = (
  this: T,
  next: (error?: Error) => void
) => Promise<void>

function increasingSequence(
  fieldName: string,
  startSeq = 1
): PreSaveMiddleware<any> {
  return async function (next) {
    const doc = this

    if (!doc.isNew) {
      return next()
    }

    try {
      const lastTopic = await doc.constructor
        .findOne({}, { [fieldName]: 1 })
        .sort({ [fieldName]: -1 })

      if (lastTopic) {
        doc[fieldName] = (lastTopic[fieldName] as number) + 1
      } else {
        doc[fieldName] = startSeq
      }

      next()
    } catch (error) {
      return next(error as Error)
    }
  }
}

export default increasingSequence
/* 
const increasingSequence = (fieldName, startSeq = 1) =>
  async function (next) {
    const doc = this;

    // 如果文档已经存在，直接执行下一步操作
    if (!doc.isNew) {
      return next();
    }

    // 获取当前文档的构造函数，用于查找上一个文档
    const Model = doc.constructor;

    try {
      // 使用一个事务来保证操作的原子性
      const session = await Model.startSession();
      session.startTransaction();

      // 查找上一个文档，并将查询锁定以避免并发问题
      const lastDoc = await Model.findOne({}, { [fieldName]: 1 })
        .sort({ [fieldName]: -1 })
        .session(session)
        .setOptions({ skipLocked: true });

      if (lastDoc) {
        // 递增字段值
        doc[fieldName] = lastDoc[fieldName] + 1;
      } else {
        doc[fieldName] = startSeq;
      }

      // 保存当前文档，并提交事务
      await doc.save({ session });
      await session.commitTransaction();
      session.endSession();

      next();
    } catch (error) {
      // 如果出现错误，回滚事务并传递错误
      return next(error);
    }
  };

export default increasingSequence;

*/
