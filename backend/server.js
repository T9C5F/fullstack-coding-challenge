if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const helmet = require('helmet')
const compression = require('compression')
const xss = require('xss-clean')
const cors = require('cors')

const CronJob = require('cron').CronJob
const crawler = require('./services/crawler.service')
const database = require('./database')

app.use(express.json())

app.use(helmet())
app.use(xss())
app.use(cors())
app.use(compression())

let healthy = false
let shuttingDown = false

console.log('Server starting...')

// -------- INIT
async function init() {
  await database.connect()

  app.listen(3000)
  app.use(require('./routes/'))

  console.log(
    'Server listening on port 3000',
    process.env.NODE_ENV === 'production' ? 'in production mode.' : 'in DEV mode.'
  )
  healthy = true
  crawl()
}
init()

// -------- CRON
// Crawl at minute 0 / every hour
const crawlJob = new CronJob('0 * * * *', async () => {
  crawl()
})
crawlJob.start()

async function crawl() {
  console.log('running crawl job')
  if (shuttingDown || !healthy) return
  const items = await crawler.crawl()
  await database.repositories.deleteMany()
  await database.repositories.insertMany(items, { ordered: false })
}

// -------- HEALTH ENDPOINT
app.get('/healthz', (req, res) => {
  if (healthy) {
    res.send('OK')
  } else {
    res.sendStatus(503)
  }
})

// -------- SIGNALS
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

async function shutdown() {
  console.info('Shutting down..')
  if (!shuttingDown) {
    shuttingDown = true
    healthy = false
    await database.close()
    process.exit()
  }
}
