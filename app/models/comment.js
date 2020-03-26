const mongoose = require('mongoose')
const { Schema, model } = mongoose
const commentSchema = new Schema(
  {
    content: { type: String, required: true, select: true },
    commentator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: true
    },
    questionId: {
      type: String,
      required: true,
      select: true
    }
  },
  { timestamps: true }
)
module.exports = model('Comment', commentSchema)
