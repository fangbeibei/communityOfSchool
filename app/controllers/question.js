const Question = require('../models/question')
class questionCtl {
  async find(ctx) {
    // 获取per_page和page并且设置默认值
    const { per_page = 10 } = ctx.query
    const perPage = Math.max(parseInt(per_page), 1)
    const page = Math.max(parseInt(ctx.query.page), 1)
    ctx.body = await Question.find({
      content: new RegExp(ctx.query.keyword)
    })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .populate('questioner topic')
  }
  async findById(ctx) {
    const question = await Question.findById(ctx.params.id).populate(
      'questioner topic'
    )
    if (!question) {
      ctx.throw(404, '问题不存在')
    }
    ctx.body = question
  }
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      topic: { type: 'string', required: true }
    })
    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id
    }).save()
    ctx.body = question
  }
  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id)
    if (!question) {
      ctx.throw(404, '问题不存在')
    }
    ctx.state.question = question
    await next()
  }
  async checkQuestioner(ctx, next) {
    if (ctx.state.question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  async deleteById(ctx) {
    await Question.deleteOne(ctx.state.question)
    ctx.body = ctx.state.question
  }
  async updateById(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false }
    })
    const content = ctx.request.body.content
    await ctx.state.question.updateOne({ content })
    ctx.body = ctx.state.question
  }
}
module.exports = new questionCtl()
