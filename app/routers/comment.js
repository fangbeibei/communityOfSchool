const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/:questionId/comment' })
const { secret } = require('../config')
const {
  find,
  findById,
  create,
  checkCommentExist,
  checkCommentator,
  deleteById,
  updateById
} = require('../controllers/comment')
const auth = jwt({ secret })
router.get('/', find)
router.get('/:id', findById)
router.post('/', auth, create)
router.delete('/:id', auth, checkCommentExist, checkCommentator, deleteById)
router.patch('/:id', auth, checkCommentExist, checkCommentator, updateById)
module.exports = router
