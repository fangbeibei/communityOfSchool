const jwt = require('jsonwebtoken')
const { secret, appSecret, appId } = require('../config')
const axios = require('axios')
const User = require('../models/user')
const Question = require('../models/question')
let generateToken = user => {
  return jwt.sign(user, secret, { expiresIn: '1d' })
}
class UserCtl {
  // 小程序获取用户openid
  async login(ctx) {
    const { name, avatar_url, code } = ctx.request.body
    const quertString = `appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
    const wxAPI = `https://api.weixin.qq.com/sns/jscode2session?${quertString}/`
    const res = await axios.get(wxAPI)
    const user = await User.findOne({ openId: res.data.openid })
    if (user) {
      console.log('老用户登陆')
      ctx.body = {
        token: generateToken({ openId: res.data.openid, _id: user._id })
      }
    } else {
      console.log('创建新用户')
      const user = await new User({
        openId: res.data.openid,
        name,
        avatar_url
      }).save()
      ctx.body = {
        token: generateToken({ openId: res.data.openid, _id: user._id })
      }
    }
  }
  // 检查token是否过期
  async check_token(ctx) {
    let token = ctx.headers.token
    // console.log(token)
    if (token) {
      console.log('token exist')
      jwt.verify(token, secret, (err, decoded) => {
        console.log('jwt.verify')
        if (err) {
          console.log(err)
          if (err.name == 'TokenExpiredError') {
            ctx.throw(401, '认证码失效,请重新登陆！')
          } else {
            ctx.throw(401, '认证失败')
          }
        } else {
          // 登陆成功
          // ctx.status = 200
          // ctx.body = {
          //   message: '已登陆'
          // }
          ctx.status = 200
        }
      })
    } else {
      console.log('no token')
      ctx.throw(403, '请提供认证码')
    }
  }
  // 校验用户是否存在
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    await next()
  }
  // 校验是否有权限
  async checkOwner(ctx, next) {
    if (!ctx.params.id == ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  // 更新用户信息
  async updateById(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false
      },
      avatar_url: {
        type: 'string',
        required: false
      },
      wx: {
        type: 'string',
        require: false
      },
      phone: {
        type: 'string',
        require: false
      }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
  // 删除用户信息
  async deleteById(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
  // 获取用户列表
  async find(ctx) {
    // 获取per_page和page并且设置默认值
    const { per_page = 10 } = ctx.query
    const perPage = Math.max(parseInt(per_page), 1)
    const page = Math.max(parseInt(ctx.query.page), 1)
    ctx.body = await User.find({ name: new RegExp(ctx.query.keyword) })
      .limit(perPage)
      .skip((page - 1) * perPage)
  }
  // 查找指定用户
  async findById(ctx) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
  // 列出用户的问题列表
  async listUserQuestions(ctx) {
    // 获取per_page和page并且设置默认值
    const { per_page = 10 } = ctx.query
    const perPage = Math.max(parseInt(per_page), 1)
    const page = Math.max(parseInt(ctx.query.page), 1)
    const questions = await Question.find({
      questioner: ctx.state.user._id
    })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .populate('topic questioner')
    ctx.body = questions
  }
  // 校验问题是否存在
  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id)
    if (!question) {
      ctx.throw(404, '问题不存在')
    }
    await next()
  }
  // 收藏问题
  async favoritingQuestions(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      '+favoritedQuestions'
    )
    if (!me.favoritedQuestions.includes(ctx.params.id)) {
      me.favoritedQuestions.push(ctx.params.id)
      await me.save()
    }
    ctx.status = 204
  }
  // 取消收藏问题
  async unfavoritingQuestions(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      '+favoritedQuestions'
    )
    const index = me.favoritedQuestions.indexOf(ctx.params.id)
    if (index > -1) {
      me.favoritedQuestions.splice(index, 1)
      await me.save()
    }
    ctx.status = 204
  }
  // 列出用户收藏的问题
  async listFavoritingQuestions(ctx) {
    // 获取per_page和page并且设置默认值
    const { per_page = 10 } = ctx.query
    const perPage = Math.max(parseInt(per_page), 1)
    const page = Math.max(parseInt(ctx.query.page), 1)
    const user = await User.findById(ctx.state.user._id)
      .limit(perPage)
      .skip((page - 1) * perPage)
      .select('+favoritedQuestions')
      .populate('favoritedQuestions')
    if (!user) {
      ctx.body = []
    } else {
      ctx.body = user.favoritedQuestions
    }
  }
}
module.exports = new UserCtl()
