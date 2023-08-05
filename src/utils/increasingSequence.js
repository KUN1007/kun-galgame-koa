/**
 * Generic function to generate an increasing sequence for a given model and field.
 * @param {String} fieldName - The name of the field to be incremented.
 * @param {Number} startSeq - The starting sequence number.
 * @returns {Function} - A pre-save middleware function to be used in the schema.
 */
const increasingSequence = (fieldName, startSeq = 1) =>
  async function (next) {
    const doc = this
    if (!doc.isNew) {
      return next()
    }

    try {
      const lastPost = await doc.constructor
        .findOne({}, { [fieldName]: 1 })
        .sort({ [fieldName]: -1 })

      if (lastPost) {
        doc[fieldName] = lastPost[fieldName] + 1
      } else {
        doc[fieldName] = startSeq
      }

      next()
    } catch (error) {
      return next(error)
    }
  }

export default increasingSequence
