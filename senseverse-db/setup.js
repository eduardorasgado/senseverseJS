'use strict'
// npm i debug --save
// con ello podemos ver el log siemmpre y cuando tengamos variables de entorno
// lo segundo es un name space proyecto-modulo-archivo
const debug = require('debug')('senseverse:db:setup')
const db = require('./')
async function setup () {
  const config = {
    database: process.env.DB_NAME || 'senseverse',
    username: process.env.DB_USER || 'cheetos',
    password: process.env.DB_PASS || '1234',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }
  // ejecutar, en caso de error, atrapamos
  await db(config).catch(handleFatalError)
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  // matamos el proceso
  process.exit(1)
}
// ejecucion
setup()
