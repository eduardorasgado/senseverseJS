'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const setupAgent = require('./lib/agent')
// se instala con npm i --save defaults
const defaults = require('defaults')

module.exports = async function (config) {
  // propiedades por defecto que serviran al agent-test
  config = defaults(config, {
    // nosotros instalamos sqlite: npm i sqlite3 --save-dev
    // para el tema de pruebas, para no conectarse en la db real
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)
  // Definiendo relaciones
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)
  // promesa para autenticar resuelta con async await
  await sequelize.authenticate()
  // si la base de datos existe, borrar la base de datos
  if (config.setup) {
    await sequelize.sync({ force: true })
  }
  const Agent = setupAgent(AgentModel)
  const Metric = {}
  return {
    Agent,
    Metric
  }
}
