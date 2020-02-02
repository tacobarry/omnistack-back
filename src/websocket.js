const socket = require('socket.io')
const parseStringArr = require('./utils/parseStringAsArray')
const calculateDistance = require('./utils/calculateDistance')

let io
const connections = []

exports.setupWebsocket = (server) => {
  io = socket(server)

  io.on('connection', socket => {
    const { latitude, longitude, techs } = socket.handshake.query
    // console.log(socket.id)
    // console.log(socket.handshake.query)

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      techs: parseStringArr(techs)
    })
  })
}

exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {
    return calculateDistance(coordinates, connection.coordinates) < 10
      && connection.techs.some(item => techs.includes(item))
  })
}

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emmit(message, data)
  })
}
