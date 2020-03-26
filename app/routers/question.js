const Router = require('koa-router')
const router = new Router({ prefix: '/questions' })
const jwt = require('koa-jwt')
const { secret } = require('../config')
const {
  find,
  findById,
  create,
  checkQuestionExist,
  checkQuestioner,
  deleteById,
  updateById
} = require('../controllers/question')
const auth = jwt({ secret })
router.get('/', find)
router.get('/:id', findById)
router.post('/', auth, create)
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, deleteById)
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, updateById)
module.exports = router
