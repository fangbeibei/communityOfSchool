const Koa = require('koa')
const app = new Koa()
const mongoose = require('mongoose')
const error = require('koa-json-error')
const path = require('path')
const koaStatic = require('koa-static')
const koaBody = require('koa-body')
const parameter = require('koa-parameter')
const { connectionStr } = require('./config')
// 配置错误处理中间件
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
  })
)
// 连接数据库
mongoose.connect(
  connectionStr,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log('远程数据库连接成功')
  }
)
mongoose.set('useFindAndModify', false)
// 配置开放静态资源
app.use(koaStatic(path.join(__dirname, '/public')))
// 配置路由中间件
const Router = require('koa-router')
const router = new Router()

// 配置koa-body
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 2 * 1024 * 1024, //最大2MB
      uploadDir: path.join(__dirname, '/public/uploads'), //保存路劲
      keepExtensions: true //是否保留后缀名
    }
  })
)
// 配置参数校验中间件
app.use(parameter(app))
//挂载路由
const routing = require('./routers/index')
routing(app)

app.listen(3000, () => {
  console.log('app is running at port 3000...')
})
