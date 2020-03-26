const path = require('path')
class HomeCtl {
  index(ctx) {
    ctx.body = 'HelloMiniprogram'
  }
  upload(ctx) {
    console.log(ctx.request.files)
    const file = ctx.request.files.file
    console.log(file)
    console.log(file.path)
    const basename = path.basename(file.path)
    console.log(basename)
    ctx.body = {
      url: `${ctx.origin}/uploads/${basename}`
    }
  }
}
module.exports = new HomeCtl()
