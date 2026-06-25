const express = require('express')
const router = express.Router()

router.use('/auth', require('./routes/auth'))
router.use('/tasks', require('./routes/tasks'))

module.exports = router