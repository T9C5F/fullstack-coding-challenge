const router = require('express').Router()
const schemas = require('../../schemas')

const crawler = require('../../services/crawler.service')
const database = require('../../database')

// GET all repositories
router.get('/', async (req, res) => {
  
  // Validate request
  const { value: requestData, error } = schemas.paginatation.validate({
    page: req.query.page,
    itemsPerPage: req.query.itemsPerPage
  })
  if (error) {
    throw error
  }

  // Get repositories
  const selector = {}
  const cursor = database.repositories.find(selector)

  // Select data to send
  const projection = {
    _id: 0,
    id: 1,
    name: 1,
    full_name: 1,
    description: 1,
    html_url: 1,
    language: 1,
    stargazers_count: 1
  }

  // Sort by stars
  const sort = { stargazers_count: -1 }

  // Paginate
  cursor.skip(requestData.itemsPerPage * (requestData.page - 1)).limit(parseInt(requestData.itemsPerPage))

  const itemsPromise = cursor.project(projection).sort(sort).toArray()
  const countPromise = database.repositories.countDocuments(selector)

  // Await promises
  const [items, count] = await Promise.all([itemsPromise, countPromise])

  // Send response
  res.send({ total_count: count, page: requestData.page, items })
})

// GET single repository
router.get('/:owner/:repo', async (req, res) => {
  // Validate request
  const { value: requestData, error } = schemas.githubFullName.validate({
    owner: req.params.owner,
    repo: req.params.repo
  })
  if (error) {
    throw error
  }

  // Get repository
  const repo = (
    await database.repositories.find({ full_name: `${requestData.owner}/${requestData.repo}` }).toArray()
  )[0]

  // Send repository
  res.send(repo)
})

// Dev endpoint to manually crawl for repositories
if (process.env.NODE_ENV !== 'production') {
  router.get('/crawl', async (req, res) => {
    const items = await crawler.crawl()
    await database.repositories.deleteMany()
    await database.repositories.insertMany(items, { ordered: false })
    res.send({ ok: true })
  })
}

module.exports = router
