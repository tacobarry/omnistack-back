'use strict'

const { Router } = require('express')
const DevController = require('./controllers/DevController')
const SearchController = require('./controllers/SearchController')

const routes = Router()

routes.get('/devs', DevController.list)
routes.post('/devs', DevController.store)

routes.patch('/devs/:github_username', DevController.update)
routes.delete('/devs/:github_username', DevController.delete)

routes.get('/search', SearchController.index)

module.exports = routes
