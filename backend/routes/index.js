const router = require('express').Router()
const build = require('../build.js')

router.get('/build', (req, res) => {
  res.send(build)
})

router.use((err, req, res, next) => {
  if (!err) {
    next()
    return
  }
  switch (err.name) {
    case 'NotFoundError':
      res.status(404)
      break
    case 'BadRequestError':
      res.status(400)
      break
    case 'UnauthorizedError':
      res.status(401)
      break
    case 'ValidationError':
      res.status(400)
      break
    default:
      console.warn(err)
      res.status(500)
  }
  res.send({ ok: false, msg: process.env.NODE_ENV !== 'production' ? err.message : null })
})

module.exports = router
