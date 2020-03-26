const Router = require('koa-router')
const router = new Router({ prefix: '/topics' })
const {
  find,
  create,
  deleteById,
  updateById,
  findById,
  listTopicQuestions
} = require('../controllers/topic')
router.get('/', find)
router.get('/:id', findById)
router.post('/', create)
router.delete('/:id', deleteById)
router.patch('/:id', updateById)
router.get('/:id/questions', listTopicQuestions)
module.exports = router
