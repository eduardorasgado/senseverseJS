'use strict';

// we implement singleton pattern
const Sequelize = require('sequelize');

let sequelize = null;

module.exports = function setupDatabase (config)
{
    // in case sequelize does not exist it should be
    // be created
    if(!sequelize)
    {
        sequelize = new Sequelize(config);
    }
    return sequelize;
};