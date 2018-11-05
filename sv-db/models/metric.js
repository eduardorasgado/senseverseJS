'use strict';
const Sequelize = require('sequelize');
const setupDatabase = require("../lib/db");

const opts = {
    type:  Sequelize.STRING,
    allowNull: false
};

// config function for agent model
module.exports = function setupMetricModel(config)
{
    // to create an instance of the database
    const sequelize = setupDatabase(config);

    // will create a table agents
    return sequelize.define('metric', {
        type: opts,
        value: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    });
};