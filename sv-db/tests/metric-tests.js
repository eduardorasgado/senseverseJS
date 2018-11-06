'use strict';

/*
* UNIT TESTING TO METRIC MODEL
* */

const test = require('ava');
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const metricFixtures = require("./fixtures/metric");
const agentFixtures = require("./fixtures/agent");

// ------------------fake values ------------
let uuid = 'yyy-yyy-yyy';
let uuid2 = 'yyy-yyy-yyw';
//uuid: "yyy-yyy-234",
let newMetric = {
    agentId: 1,
    type: "test",
    value: "some description for type and the metric itself"
}

// to test findOne stub
let uuidArgs = {
    where: { uuid }
}

//---------- variables and jsons for testing------
// to fake the relation and the model Agent
let AgentStub = null;
// creating the fake metric to test vs original
let MetricStub = null;

// test sinon in other scope
let sandbox = null;
let sandbox2 = null;

let db = null;
const config = {
    // empty to call defaults on db
    logging(){}
}
test.beforeEach( async () =>
{
    // one sandbox for agent and metric
    sandbox = sinon.createSandbox();
    sandbox2 = sinon.createSandbox(); // metric sandbox

    AgentStub = {
        hasMany: sandbox.spy()
    };
    // initializing Metric stub
    MetricStub = {
        belongsTo: sandbox2.spy()
    }

    // Model findOne stub for use in Metric services
    AgentStub.findOne = sandbox.stub();
    AgentStub.findOne.withArgs(uuidArgs)
        .returns(Promise.resolve(agentFixtures.byUuid(uuid)));

    // //Model create stub
    MetricStub.create = sandbox2.stub();
    MetricStub.create.withArgs(newMetric)
        .returns(Promise.resolve(
            {
                toJSON() { return newMetric }
            }
        ));

    // open ../index.js and substitute some things
    // to be able to practice testing safely with sqlite3
    const setupDatabase = proxyquire('../', {
        './models/agent': () => AgentStub,
        './models/metric': () => MetricStub
    });
    db = await setupDatabase(config);
});

test.afterEach(() =>
{
    sandbox && sandbox.restore();
    sandbox2 && sandbox.restore();
})

// test to ava
test('make metric test pass', t =>
{
    t.pass();
});

test('Metric', t =>
{
    // expecting any return could indicates Metric exists
    t.truthy(db.Metric, "Metric service should exist");
});

test.serial('Setup', t =>
{
    t.true(AgentStub.hasMany.called, "Agent model has many has no been executed.");
    t.true(MetricStub.belongsTo.called, "Metric Stub belongsTo has not been executed.");

    t.true(AgentStub.hasMany.calledWith(MetricStub), "AgentStub.hasMany was not executed");
    t.true(MetricStub.belongsTo.calledWith(AgentStub), "MetricStub.belongsTo was not executed");
})

test.serial('Metric#create', async t =>
{
    // evaluating create service
    let metric = await db.Metric.create(uuid, newMetric);
    t.true(AgentStub.findOne.called, "AgentStub findOne should be called");
    t.true(MetricStub.create.called, "MetricStub create should be called");
    t.deepEqual(metric, newMetric, "new metric should be the same for both cases");
});

test.serial('Metric#findByAgentUuid', async t =>
{
    //
    t.pass();
});

test.serial('Metric#findByTypeAgentUuid', async t =>
{
    //
    t.pass();
});