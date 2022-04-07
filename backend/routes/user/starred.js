const router = require('express').Router()
const database = require('../../database')
const schemas = require('../../schemas')

// GET user starred repositories
router.get('/', async (req, res) => {
  const dbRes = await database.stars.find({ user: 'default' }).toArray()
  const starred = dbRes.map(({ repo }) => repo)
  res.send({ repoIds: starred })
})

// PUT star for repository by owner/reponame
router.put('/:owner/:repo', async (req, res) => {
  let repoId = await getRepoId(req.params.owner, req.params.repo)
  const starred = await database.stars.find({ user: 'default', repo: repoId }).toArray()
  if (starred.length > 0) {
    // check if already starred
    const error = new Error('Already starred')
    error.name = 'BadRequestError'
    throw error
  }
  await database.stars.insertOne({ user: 'default', repo: repoId })
  res.send({ ok: true })
})

// DELETE star for repository by owner/reponame
router.delete('/:owner/:repo', async (req, res) => {
  let repoId = await getRepoId(req.params.owner, req.params.repo)
  await database.stars.deleteOne({ repo: repoId, user: 'default' })
  res.send({ ok: true })
})

// helper function to get repo id
async function getRepoId(owner, repo) {
  // Validate request
  const { value: requestData, error } = schemas.githubFullName.validate({
    owner: owner,
    repo: repo
  })
  if (error) {
    throw error
  }

  let repoId
  try {
    repoId = (await database.repositories.find({ full_name: `${requestData.owner}/${requestData.repo}` }).toArray())[0]
      .id
  } catch (e) {
    // repo not found
    console.log(requestData, e)
    const error = new Error('Repository not found', { cause: e })
    error.name = 'BadRequestError'
    throw error
  }
  return repoId
}

module.exports = router
