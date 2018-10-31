'use strict';

const setupDatabase = require("./lib/db");
// in agent-test these two requirements will be substitute
// by stubs
const setupAgentModel = require("./models/agent");
const setupMetricModel = require("./models/metric");

// a package to make default values easier
// USE: it overrides all of undefined properties in
// options with the clones of properties defined
// in defaults
const defaults = require('defaults');

// this module should return a promise
module.exports = async function(config)
{
    //taking properties in config, in case
    // they are not defined, take these by default
    config = defaults(config, {
        // defaults to be able to make unit testing
        // safely to agents
        // database in memory
        dialect: 'sqlite',
        pool: {
            max: 10,
            min: 0,
            idle: 10000
        },
        query: {
            // each query it should delivers JSON
            // reason: sqlite usually delivers complex objects
            raw: true
        }
    });

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