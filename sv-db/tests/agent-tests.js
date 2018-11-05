/*
* UNIT TESTING FOR TEST DRIVEN SOFTWARE DEVELOPMENT
*
* Test Coverage(nyc module):
*   A technique to discover the percentage of
*   the project's code that actually is been tested.
*   To apply:
*   nyc --reporter=lcov in json:
*       "test": "DEBUG=senseverse:* nyc --reporter=lcov ava tests/ --verbose",

*   will be make available our test suite analysis in
*   a easy way: html inside coverage folder in root of the
*   project
* */

'use strict';
/* requiring ava, a Unit Testing Enviroment for NodeJS*/
const test = require('ava');
const proxyquire = require("proxyquire");
// calling the mock suite to test funcionality
const agentFixtures = require("./fixtures/agent");

/*
    Terminology:(in Spanish)

    Stub, objeto que es similar en su funcionalidad al objeto
    original (nuestro modelo), pero que la respuesta y los
    argumentos de entrada están previamente especificados con
    una librería o estrategia. Objetos falsos que se van a
    comportar de manera similar a los objetos reales.

    Spy es una función específica que permite hacer preguntas
    como: ¿Cuantas veces fue llamada una función?, ¿con que
    argumentos?, es muy útil a la hora de hacer pruebas.

    Sandbox ambiente especifico de sinon que va a funcionar para
    un caso particular (no de manera global). Cuando se termine
    de ejecutar la prueba se reinicia el sandbox.

* */
const sinon = require("sinon");

// we don't want to make a test using my database
// in postgres, it will be in sqlite
const config = {
    //
};

// for mocks and stubs
// Stubs are used to make an abstraction of our objects
// in case we want to make testing,
// we are using SINON module to make these stubs
let MetricStub = {
    // spy is a function to be able to make question in test
    belongsTo: sinon.spy()
};


// cloning object single from fixtures
let single = Object.assign({}, agentFixtures.single);
// bring all the agents in fixtures/agent
let allFromFixture = agentFixtures.all;
// connected from fixtures
let allConnected = agentFixtures.connected;

// id will be used in a test Agent#findById
let id = 1;
let uuid = 'yyy-yyy-yyy';

// this stub will be implemented in beforeEach
let AgentStub = null;
// to be able to use sinon in other scope
let sandbox = null;

// to ttest createOrUpdateStub
let uuidArgs = {
    where: {
        uuid
    }
};

// to test connected agents in findConnected stub
let usernameArgs = {
    where: {
        connected: true
    }
};

// to test createOrUpdate agent service when it does not exist
let newAgent = {
    uuid: '234-123-123',
    name: 'testGuy',
    username: 'test123',
    hostname: 'test',
    pid: 0,
    connected: false
}

let db = null;
// before each test we can create instances or whatever we need
test.beforeEach(async () =>
{
    // creating sandbox to be able to call sinon spy inside
    // this scope
    sandbox = sinon.createSandbox();
    // stub to complement relation between metric and
    // agent
    AgentStub = {
        // we create a sinon sandbox because this stub
        // is not a global stub
        hasMany: sandbox.spy()
    };

    // Model findOne stub(agent service abstraction)
    AgentStub.findOne = sandbox.stub();
    // for cond object in service agent
    AgentStub.findOne.withArgs(uuidArgs)
        // lib/agent service findOne is inside an await statement
        // so this stub should return a promise
        .returns(Promise.resolve(agentFixtures.byUuid(uuid)));

    // Model update stub
    AgentStub.update = sandbox.stub();
    // taking same arguments that createOrUpdate is taking
    // then (agent, cond)
    AgentStub.update.withArgs(single, uuidArgs)
        .returns(Promise.resolve(agentFixtures.byUuid(uuid)));

    // Model create stub, to test createOrUpdate if agent does not
    // exist
    AgentStub.create = sandbox.stub();
    AgentStub.create.withArgs(newAgent)
        // returning special usr with test username
        .returns(Promise.resolve(
            {
                // implementing the method toJSON for create service
                toJSON() { return newAgent }
            }
        ));

    // Model findById Stub, it is a functionality for
    // find id testing
    AgentStub.findById = sandbox.stub();
    // returns a promise because the request is
    // async
    AgentStub.findById.withArgs(id).returns(
        // returning the function inside fixture agent
        // it will receives the json with the user(fake)
        Promise.resolve(agentFixtures.byId(id))
    );

    // Model function findAll() stub for findAll service
    AgentStub.findAll = sandbox.stub();
    AgentStub.findAll.withArgs()
        .returns(agentFixtures.all);
    // Same model findAll() but for findConnected service
    // It should have true as argument(look at lib/agent)
    // we do not need to redeclare the stub, stub can be difference
    // with and without args by AVA
    //AgentStub.findAll = sandbox.stub();
    AgentStub.findAll.withArgs(usernameArgs)
        .returns(agentFixtures.connected);

    //  this promise will pass an empty config json
    // to setupDatabase, and thanks to defaults module
    // it will handle database connection to sqlite and
    // not to postgres real db, to make secure testing
    const setupDatabase = proxyquire('../', {
        // this is possible because of PROXYQUIRE module
        // this will intercepts the import of these real
        // models and will pass the stubs to make the testing
        './models/agent': () => AgentStub,
        './models/metric': () => MetricStub
    });
    // calling the promise given by index.js
    // and passing the empty config
    // empty will be taken by defaults module and substitute
    // postgres by sqlite3
    db = await setupDatabase(config);
});

// note that this will be executed after each test,
// and it is not an async function
test.afterEach(() =>
{
    // if a sandbox exists, recreate it
    sandbox && sandbox.restore()
});

// check package.json to test script setting
test('make it pass', t =>
{
    // this is a test for ava installed checking
    t.pass()
});

test('Agent', t =>
{
    // truthy means we obtain a value, and that value can
    // be taken as true
    t.truthy(db.Agent, "Agent service should exist");
});

//Avoiding ava does parallel testing
// it results in sequential testing
test.serial('Setup', t =>
{
    // these properties come from sinon
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany has been executed');
    t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the metric model');

    t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed.');
    t.true(MetricStub.belongsTo.calledWith(AgentStub), ' Argument should be the agent model')
});

test.serial('Agent#findById', async t =>
{
    // creating a test using fixtures
    // calling the service of agent model defined in lib/agent
    let agent = await db.Agent.findById(id);

    t.true(AgentStub.findById.called, 'findById should be called');
    t.true(AgentStub.findById.calledOnce, 'findById should be called once');
    t.true(AgentStub.findById.calledWith(id), 'findById should be called with specified id');

    // making the test calling byId defined in fixture/agent
    t.deepEqual(agent, agentFixtures.byId(id), "should be the same");
});

test.serial('Agent#createOrUpdate -exist', async t =>
{
    // testing when user exists
    let agent = await db.Agent.createOrUpdate(single);

    // verifying all stubs are called in a proper way
    t.true(AgentStub.findOne.called, "findOne should be called on model");
    // verifying the stub is called twice as it does in original
    // service implementation
    t.true(AgentStub.findOne.calledTwice, "findOne should be called twice");
    t.true(AgentStub.update.calledOnce, "Update should be called once");
    t.deepEqual(agent, single, 'agent should be the same');
});

test.serial('Agent#createOrUpdate -new', async t =>
{
    // testing when user exists
    let agent = await db.Agent.createOrUpdate(newAgent);

    // verifying all stubs are called in a proper way
    t.true(AgentStub.findOne.called, "findOne should be called on model");
    t.true(AgentStub.findOne.calledOnce, "findOne should be called once on model");
    t.true(AgentStub.findOne.calledWith(
        {
            where: {
                uuid: newAgent.uuid
            }
        }
    ), "findOne should be called with uuid args");

    t.true(AgentStub.create.calledOnce, "Create service should be called");
    t.true(AgentStub.create.calledOnce, "Create service should be called once");
    t.true(AgentStub.create.calledWith(newAgent), "Create service should be called with uuid args");

    t.deepEqual(agent, newAgent, 'new agent should be the same');
});


test.serial('Agent#findByUuid', async (t) =>
{
    // testing finding agent  using an uuid
    let agent = await db.Agent.findByUuid(uuid);
    // checking procedures integrity
    t.true(AgentStub.findOne.calledOnce, "findOne should be called once in findByUuid testing");
    t.deepEqual(agent, agentFixtures.byUuid(uuid), "UUID should be the same");
});

test.serial('Agent#findAll', async t =>
{
    // basically look for all users, do not need arguments
    let all = await db.Agent.findAll();
    t.true(AgentStub.findAll.calledOnce, "findAll not called once.");
    t.deepEqual(all, allFromFixture, "Agents are not equal");
});

test.serial('Agent#findConnected', async t =>
{
    //
    let connected = await db.Agent.findConnected();
    t.true(AgentStub.findAll.calledOnce, "findAll with args for connected agents search should be called once");
    // allConnected is declared above this file and are the results
    // in agent fixtures
    t.deepEqual(connected, allConnected, "Connected agents are not the same");
});