if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const helmet = require('helmet')
const compression = require('compression')
const xss = require('xss-clean')
const cors = require('cors')

app.use(express.json())

app.use(helmet())
app.use(xss())
app.use(cors())
app.use(compression())

console.log('Server starting...')

// -------- INIT
async function init() {
  app.listen(3000)
  app.use(require('./routes/'))

  console.log(
    'Server listening on port 3000',
    process.env.NODE_ENV === 'production' ? 'in production mode.' : 'in DEV mode.'
  )
}
init()

