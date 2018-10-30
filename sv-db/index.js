'use strict';

const setupDatabase = require("./lib/db");
const setupAgentModel = require("./models/agent");
const setupMetricModel = require("./models/metric");

// this module should return a promise
module.exports = async function(config)
{
    // this design pattern will let us create
    // easy unit testing
    const sequelize = setupDatabase(config);
    const AgentModel = setupAgentModel(config);
    const MetricModel = setupMetricModel(config);

    // defining relations
    // creating foreign keys between models
    AgentModel.hasMany(MetricModel);
    MetricModel.belongsTo(AgentModel);

    // validating if db is well initialized
    // solving by Promise
    // if this function fails, the general function
    // will stop
    await sequelize.authenticate();

    // database configuration
    //sequelize.sync();
    // requiring ./setup.js setup flag after
    // running correct settings
    // force true: if database exists: delete db and create new
    if(config.setup) await sequelize.sync({ force: true });

    const Agent = {};
    const Metric = {};

    return {
        Agent,
        Metric
    };
};