'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')

module.exports = function (config) {
	const sequelize = setupDatabase(config)
	const AgentModel = setupAgentModel(config)
	const MetricModel = setupMetricModel(config)
	//Definiendo relaciones
	AgentModel.hasMany(MetricModel)
	MetricModel.belongsTo(AgentModel)
	//promesa para autenticar resuelta con async await
	await sequielize.authenticate()
	const Agent = {}
	const Metric = {}
	return {
		Agent,
		Metric
	}
}
