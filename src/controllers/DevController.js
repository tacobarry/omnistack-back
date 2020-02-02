'use strict'

const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringArr = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

module.exports = {

  async list (req, res) {
    const devs = await Dev.find()

    return res.json(devs)
  },

  async store (req, res) {
    const { github_username, techs, latitude, longitude } = req.body

    let dev = await Dev.findOne({ github_username })

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

      let { name, login, avatar_url, bio } = apiResponse.data
      if (!name) {
        name = login
      }

      const techsArr = parseStringArr(techs)

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }

      dev = await Dev.create({
        github_username,
        avatar_url,
        name,
        bio,
        techs: techsArr,
        location
      })

      // Filtrar as conexoes que estao a no maximo 10km de disancia e que o novo dev tenha 
      // pelo menos uma das tecnologias filtradas
      const sendSocketMessegeTo = findConnections(
        { latitude, longitude },
        techsArr
      )

      sendMessage(sendSocketMessegeTo, 'new-dev', dev)
    }

    return res.json(dev)
  },

  async update (req, res) {
    const githubUsername = req.params.github_username

    const dev = await Dev.findOne({ github_username: githubUsername })

    const techsArr = parseStringArr(req.body.techs)
    const bio = req.body.bio
    const avatar_url = req.body.avatar_url
    const location = {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude]
    }

    if ('' === req.body.techs || req.body.techs) {
      dev.techs = techsArr
    }
    if ('' === req.body.bio || req.body.bio) {
      dev.bio = bio
    }
    if ('' === req.body.avatar_url || req.body.avatar_url) {
      dev.avatar_url = avatar_url
    }
    if (req.body.latitude && req.body.longitude) {
      dev.location = location
    }

    await dev.save()

    return res.json(dev)
  },

  async delete (req, res) {
    const githubUsername = req.params.github_username
    // console.log(req.params)

    await Dev.findOneAndDelete({ github_username: githubUsername })
    // Dev.deleteOne({ _id: dev._id })

    return res.json({ message: 'deletado com sucesso' })
  }
}
