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
const debug = require("debug")('senseverse:db:setup');
// colors in console
const chalk = require("chalk");
// to make user some questions
const inquirer= require("inquirer");

// promt let me mkae questions to user, those questions are promises
const prompt = inquirer.createPromptModule();

async function setup() {
    // before all we make a question
    const answer = await prompt([
        {
            type: 'confirm',
            name: 'setup',
            message: 'This is going to destroy DB, are you sure?'
        }
    ]);
    // handling answer, in case of negative answer, just exit
    if(!answer.setup) return console.log('Operation cancelled');

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
    console.log(`${chalk.blue('[MESSAGE]')}: ${"Success!"}`);
    // sending flag of no errors
    process.exit(0);
}

function handleFatalError (err)
{
    // in case db initialization fails
    console.error(`${chalk.red('[Fatal error]')}: ${err.message}`);
    console.error(err.stack);
    // return a 1 flag: failure
    process.exit(1);
}

// executing setup
setup();