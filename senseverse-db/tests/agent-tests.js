'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentFixtures = require('./fixtures/agent')

let config = {
  logging: function () {}
}

let MetricStub = {
  // En modelo de metricas en index.js
  // un spy es una funcion especifica que permite hacer preguntas
  belongsTo: sinon.spy()
}

//clonamos para tener una instancia por aparte de la de agentFixtures
let single = Object.assign({}, agentFixtures.single)
let id = 1

let AgentStub = null
let db = null
let sandbox = null

// correr una funcion previo al test
test.beforeEach(async () => {
  // sinon sandbox necesario para el caso del hasMany
  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }
  // En vez de usar require usaremos proxyquire
  // const setupDatabase = require('../')
  // en vez de usar los models nombrados al inicio de index.js
  // usa los del stub
  const setupDatabase = proxyquire('../', {
  	'./models/agent': () => AgentStub,
  	'./models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  // si existe sandbox entonces restore
  sandbox && sandbox.restore()
})

test('Agent', t => {
  // dice que existe un valor que resuelve a verdadero
  t.truthy(db.Agent, 'Agent service should exist')
})

// es necesario que los test sean seriales porque ava hace los
// test de manera paralela, y si no lo ahcemos seriales sinon no
// va a funcionar bien
// setup garantiza que has many fue llamado
test.serial('Setup', t => {
  // funciones que sinon va a ejecutar
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')
  t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})

test.serial('Agent#findById', async t => {
	let agent = await db.Agent.findById(id)

	t.deepEqual(agent, agentFixtures.findById(id), 'should be the same')
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
#------------------------------------
STOPS Y MOCKS DE LOS MODELOS
Sinon
npm install --save-dev sinon

#--------------------------
requerir un modulo pero sobreescribir los require
npm install proxyquire --save-dev
*/
