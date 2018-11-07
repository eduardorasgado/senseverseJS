'use strict';
//const debug = require('debug');

module.exports = {
    configDB: function(option, option2, debug) {
        const config = {
            database: process.env.DB_NAME || 'senseversedb',
            username: process.env.DB_USER || 'senseversedb',
            password: process.env.DB_PASS || 'senseversedb',
            host: process.env.DB_HOST || 'localhost',
            // Sequelize property to set database communication
            dialect: 'postgres'
        };

        if(option)
        {
            Object.assign(config, {setup: true},);
        }
        if(option2)
        {
            // string based operators are now deprecated
            //expecting Sequelize.Op
            Object.assign(config, {operatorsAliases: option2});
        }
        if (debug)
        {
            // to script monitoring
            // each message arrives to setup, it will pass through debug
            Object.assign(config,{logging: s => debug(s)});
        }
        return config;
    }
}

