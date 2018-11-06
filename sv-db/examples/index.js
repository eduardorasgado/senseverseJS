'use strict';
// doing an example to test database module
const db = require("../");
const Sequelize = require("sequelize");

async function run()
{
    const config = {
        database: process.env.DB_NAME || 'senseversedb',
        username: process.env.DB_USER || 'senseversedb',
        password: process.env.DB_PASS || 'senseversedb',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        operatorsAliases: Sequelize.Op
    }

    const { Agent, Metric } = await db(config)
        .catch(handleFatalError);
}

function handleFatalError(err)
{
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
}

run();