const ObjectID = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient

const database = {
  db: null,
  repositories: null,
  async connect() {
    try {
      const url = process.env.MONGODB_URL ?? 'mongodb://127.0.0.1:27017/'

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }

      this.client = await MongoClient.connect(url, options)
    } catch (e) {
      console.warn(e)
      process.exit(1)
    }
    this.db = this.client.db('coding-challenge')
    this.repositories = this.db.collection('repositories')
  },
  async close() {
    this.client.close()
  }
}
module.exports = database
