'use strict'

module.exports = (arrayAsString) => {
  return !arrayAsString ? [] : arrayAsString.split(',').map(str => str.trim())
}
