'use strict';
const Sequelize = require('sequelize');
const setupDatabase = require("../lib/db");

const opts = {
    type:  Sequelize.STRING,
    allowNull: false
};

// config function for agent model
module.exports = function setupAgentModel(config)
{
    // to create an instance of the database
    const sequelize = setupDatabase(config);

    // will create a table agents
    return sequelize.define('agent', {
        uuid: opts,
        username: opts,
        name: opts,
        hostname: opts,
        pid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        connected: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
};