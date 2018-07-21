'use strict'

/*
Para instalar squelizer y pg:
npm i -S sequelize pg pg-hstore
*/

const Sequelize = require('sequelize')
let sequelize = null

module.exports = function setupDatabase (config) {
  if (!sequelize) {
    sequelize = new Sequelize(config)
  }
  return sequelize
}
