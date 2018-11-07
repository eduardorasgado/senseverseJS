/*
* Before this script was created, and executed:
* role and db was created on postgresql
* */
'use strict';

// require index.js
const db = require("./");
const Sequelize = require("sequelize");
const configModule = require("../config/configDB");

// debug package to script and db process monitoring
// second parenthesis: a namespace -> project:module:file
const debug = require("debug")('senseverse:db:setup');
// colors in console
const chalk = require("chalk");
// to make user some questions
const inquirer= require("inquirer");

// promt let me make questions to user, those questions are promises
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

    const config = configModule.configDB(true, Sequelize.Op, debug);

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