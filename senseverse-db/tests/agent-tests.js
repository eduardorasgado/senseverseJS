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
