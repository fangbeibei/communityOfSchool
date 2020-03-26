const mongoose = require('mongoose')
const { Schema, model } = mongoose
const topicSchema = new Schema(
  {
    __v: { type: Number, select: false },
    title: { type: String, required: true, select: true },
    description: { type: String, required: false, select: true }
  },
  { timestamps: true }
)
module.exports = model('Topic', topicSchema)
