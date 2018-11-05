'use strict';

/*
* UNIT TESTING TO METRIC MODEL
* */

const test = require('ava');
const sinon = require("sinon");
const metricFixtures = require("./fixtures/metric");

// fake values
let uuid = 'yyy-yyy-yyy';

// creating the fake metric to test vs original
let MetricStub = null;
// test sinon in other scope
let sandbox = null;

// to test findOne stub
let uuidArgs = {
    where: uuid
}

// test to ava
test('make metric test pass', t =>
{
    t.pass();
});