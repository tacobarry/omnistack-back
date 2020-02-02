'use strict'

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const routes = require('./routes')
const { setupWebsocket } = require('./websocket.js')
require('dotenv').config()

const PORT = process.env.PORT || 3333
const DB_URL = process.env.DB_URL
const app = express()
const server = http.Server(app)

setupWebsocket(server)

mongoose.connect(
  DB_URL
  , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })

app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
