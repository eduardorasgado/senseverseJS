/*
* Before this script was created, and executed:
* role and db was created on postgresql
* */
'use strict';

// require index.js
const db = require("./");
const Sequelize = require("sequelize");

// debug package to script and db process monitoring
// second parenthesis: a namespace -> project:module:file
const debug = require('debug')('senseverse:db:setup');

async function setup() {
    const config = {
        database: process.env.DB_NAME || 'senseversedb',
        username: process.env.DB_USER || 'senseversedb',
        password: process.env.DB_PASS || 'senseversedb',
        host: process.env.DB_HOST || 'localhost',
        // Sequelize property to set database communication
        dialect: 'postgres',
        // to script monitoring
        // each message arrives to setup, it will pass through debug
        logging: s => debug(s),
        // flag to start operations in index.js(sv-db)
        setup: true,
        // string based operators are now deprecated
        operatorsAliases: Sequelize.Op
    };
    // handling a promise
    await db(config)
        .catch(handleFatalError);

    // if await passed:
    console.log("Success!");
    // sending flag of no errors
    process.exit(0);
}

function handleFatalError (err)
{
    // in case db initialization fails
    console.error(err.message);
    console.error(err.stack);
    // return a 1 flag: failure
    process.exit(1);
}

// executing setup
setup();