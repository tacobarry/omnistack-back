'use strict'

module.exports = {
  isEmpty (arr) {
    if (!arr) {
      return true
    }
    if (arr.length > 0) {
      return false
    } else {
      return true
    }
  }
}
