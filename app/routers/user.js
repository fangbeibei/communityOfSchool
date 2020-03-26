const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const {
  login,
  check_token,
  find,
  findById,
  deleteById,
  updateById,
  checkOwner,
  checkUserExist,
  listUserQuestions,
  checkQuestionExist,
  favoritingQuestions,
  unfavoritingQuestions,
  listFavoritingQuestions
} = require('../controllers/user')
const { secret } = require('../config')
const jwt = require('koa-jwt')
const auth = jwt({ secret })
// 登陆
router.post('/login', login)
// 检查token是否有效
router.post('/auth', check_token)
// 查看用户列表
router.get('/', find)
// 获取用户问题列表
router.get('/questions', auth, listUserQuestions)
// 列出用户收藏的问题
router.get('/favoriting', auth, listFavoritingQuestions)
// 查找指定用户
router.get('/:id', findById)
// 删除指定用户
router.delete('/:id', auth, checkUserExist, deleteById)
// 更新用户信息
router.patch('/:id', auth, checkUserExist, checkOwner, updateById)
// 收藏问题
router.put('/favoriting/:id', auth, checkQuestionExist, favoritingQuestions)
// 取消收藏问题
router.delete(
  '/favoriting/:id',
  auth,
  checkQuestionExist,
  unfavoritingQuestions
)

module.exports = router
