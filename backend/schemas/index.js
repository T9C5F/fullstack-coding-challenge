const Joi = require('joi')

const githubFullName = Joi.object({
  owner: Joi.string()
    .regex(/^[\w\.@\:/\-~]+$/)
    .min(3)
    .max(30)
    .required(),
  repo: Joi.string()
    .regex(/^[\w\.@\:/\-~]+$/)
    .min(3)
    .max(30)
    .required()
})

const paginatation = Joi.object({
  page: Joi.number().integer().min(1).max(1000).default(1),
  itemsPerPage: Joi.number().integer().min(1).max(30).default(30)
})

module.exports = { githubFullName, paginatation }
