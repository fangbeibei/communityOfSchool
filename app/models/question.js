const mongoose = require('mongoose')
const { Schema, model } = mongoose
const questionSchema = new Schema(
  {
    content: { type: String, required: true, select: true },
    questioner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: true
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      select: true
    }
  },
  { timestamps: true }
)
module.exports = model('Question', questionSchema)
