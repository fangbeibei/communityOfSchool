const Topic = require('../models/topic')
const Question = require('../models/question')
class TopicCtl {
  async find(ctx) {
    const topics = await Topic.find()
    ctx.body = topics
  }
  async findById(ctx) {
    const topic = await Topic.findById(ctx.params.id)
    if (!topic) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = topic
  }
  async create(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      decription: { type: 'string', required: false }
    })
    const { title } = ctx.request.body
    const user = await Topic.findOne({ title })
    if (user) {
      ctx.throw(409, '话题已存在')
    }
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }
  async deleteById(ctx) {
    const topic = await Topic.findByIdAndRemove(ctx.params.id)
    if (!topic) {
      ctx.throw(404, '话题不存在')
    }
    ctx.body = topic
  }
  async updateById(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false }
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!topic) {
      ctx.throw(404, '话题不存在')
    }
    ctx.body = topic
  }
  async listTopicQuestions(ctx) {
    // 获取per_page和page并且设置默认值
    const { per_page = 10 } = ctx.query
    const perPage = Math.max(parseInt(per_page), 1)
    const page = Math.max(parseInt(ctx.query.page), 1)
    const questions = await Question.find({
      topic: ctx.params.id
    })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .populate('topic questioner')
    ctx.body = questions
  }
}
module.exports = new TopicCtl()
