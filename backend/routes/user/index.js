const router = require('express').Router()

router.use('/starred', require('./starred'))

module.exports = router
