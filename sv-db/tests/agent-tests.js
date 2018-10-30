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

// we don't want to make a test using my database
// in postgres, it will be in sqlite
const config = {
    //
};

let db = null;
// before each test we can create instances or whatever we need
test.beforeEach(async () =>
{
    //  this promise will pass an empty config json
    // to setupDatabase, and thanks to defaults module
    // it will handle database connection to sqlite and
    // not to postgres real db, to make secure testing
    const setupDatabase = require('../');
    db = await setupDatabase(config);
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