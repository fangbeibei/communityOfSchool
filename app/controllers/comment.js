const Comment = require('../models/comment')
class CommentCtl {
  async find(ctx) {
    // 获取per_page和page并且设置默认值
    const { per_page = 10 } = ctx.query
    const page = Math.max(parseInt(ctx.query.page), 1)
    const perPage = Math.max(parseInt(per_page), 1)
    const comments = await Comment.find({
      $or: [
        { questionId: ctx.params.questionId },
        { content: new RegExp(ctx.query.keyword) }
      ]
    })
      .limit(perPage)
      .skip(perPage * (page - 1))
      .populate('commentator')
    ctx.body = comments
  }
  async findById(ctx) {
    const comment = await Comment.findById(ctx.params.id).populate(
      'commentator'
    )
    if (!comment) {
      ctx.throw(404, '答案不存在')
    }
    ctx.body = comment
  }
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const comment = await new Comment({
      content: ctx.request.body.content,
      questionId: ctx.params.questionId,
      commentator: ctx.state.user._id
    }).save()
    ctx.body = comment
  }
  async checkCommentExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id)
    if (comment.questionId !== ctx.params.questionId) {
      ctx.throw(404, '该答案下没有此评论')
    }
    ctx.state.comment = comment
    await next()
  }
  async checkCommentator(ctx, next) {
    const comment = ctx.state.comment
    if (comment.commentator.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  async deleteById(ctx) {
    await Comment.deleteOne(ctx.state.comment)
    ctx.body = ctx.state.comment
  }
  async updateById(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const { content } = ctx.request.body
    await ctx.state.comment.updateOne({ content })
    ctx.body = ctx.state.comment
  }
}
module.exports = new CommentCtl()
