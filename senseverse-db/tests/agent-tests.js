'use strict'

const test = require('ava')

let config = {
  logging: function () {}
}

let db = null

// correr una funcion previo al test
test.beforeEach(async () => {
  const setupDatabase = require('../')
  db = await setupDatabase(config)
})

test('Agent', t => {
  // dice que existe un valor que resuelve a verdadero
  t.truthy(db.Agent, 'Agent service should exist')
})
/*
Test Coverage
Se encarga de checar si los test estan considerando todo el proyecto o no,
por porcentajes por ejemplo, herramientas:

istanbul
nyc ->cli para istanbul

instalacion:

npm i nyc --save-dev

Agregarlo asi en package json en scripts:
	"test": "DEBUG=senseverse:* nyc --reporter=lcov ava tests/ --verbose"
Para poder generar reportes y mandarlo a html
Ver estos html en coverage, carpeta que se crea para reportear
*/