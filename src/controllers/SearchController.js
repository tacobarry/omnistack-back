'use strict'

const Dev = require('../models/Dev')
const parseStringArr = require('../utils/parseStringAsArray')
const arrUtils = require('../utils/arrayUtils.js')

module.exports = {
  async index (req, res) {
    const { latitude = 0, longitude = 0, techs } = req.query

    const techsArr = parseStringArr(techs)

    const query = {
      techs: {
        $in: techsArr
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000
        }
      }
    }

    if (arrUtils.isEmpty(techsArr)) {
      delete query.techs
    }

    const devs = await Dev.find(query)

    return res.json(devs)
  }
}
