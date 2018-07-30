'use strict'
// npm i debug --save
// con ello podemos ver el log siemmpre y cuando tengamos variables de entorno
// lo segundo es un name space proyecto-modulo-archivo
/*
Antes de correr activar la database:
sudo systemctl start postgresql

Despues para corregir bajo estandar:
npm run lint
Para corregir errores:
npm run lint -- --fix

*/
const debug = require('debug')('senseverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')
const prompt = inquirer.createPromptModule()
async function setup () {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your database, are you sure?'
    }
  ])

  if (!answer.setup) {
    return console.log('Nothing happened :)')
  }

  const config = {
    database: process.env.DB_NAME || 'senseverse',
    username: process.env.DB_USER || 'cheetos',
    password: process.env.DB_PASS || '1234',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true,
    operatorsAliases: false
  }
  // ejecutar, en caso de error, atrapamos
  await db(config).catch(handleFatalError)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  // matamos el proceso
  process.exit(1)
}
// ejecucion
setup()
