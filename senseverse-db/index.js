'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')

module.exports = async function (config) {
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
  const Agent = {}
  const Metric = {}
  return {
    Agent,
    Metric
  }
}
