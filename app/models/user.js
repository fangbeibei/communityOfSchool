const mongoose = require('mongoose')
const { Schema, model } = mongoose
const userSchema = new Schema(
  {
    __v: { type: Number, select: false },
    openId: { type: String, required: true, select: true },
    name: { type: String, required: true, select: true },
    avatar_url: { type: String, required: true, select: true },
    wx: { type: String, select: true },
    phone: { type: String, select: true },
    favoritedQuestions: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
      required: false,
      select: false
    }
  },
  { timestamps: true }
)
module.exports = model('User', userSchema)
