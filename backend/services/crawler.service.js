const request = require('undici').request
const parseLinkHeader = require('parse-link-header')

const crawl = async () => {
  // Calculate date of last week
  const date = new Date()
  date.setDate(date.getDate() - 7)
  const dateString = date.toISOString().split('T')[0]

  // Docs: https://docs.github.com/en/rest/reference/repos
  let nextUrl = `https://api.github.com/search/repositories?q=created:>${dateString}&sort=stars&order=desc`

  let items = []
  let rateLimitRemaining = 10

  // Crawl until there are no more pages or we hit the rate limit
  while (rateLimitRemaining > 8 && nextUrl) {
    const { statusCode, headers, body } = await request(nextUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'request'
      }
    })

    rateLimitRemaining = parseInt(headers['x-ratelimit-remaining'] ?? 0)
    try {
      nextUrl = parseLinkHeader(headers.link).next.url
    } catch (e) {
      // set nextUrl to null to break the loop
      nextUrl = null
    }

    if (statusCode !== 200) {
      console.warn('Github API returned status code ' + statusCode)
      nextUrl = null
    }
    const response = await body.json()

    // Add items to list
    items.push(...response.items)
  }

  return items
}

module.exports = {
  crawl
}
