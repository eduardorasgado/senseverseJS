'use strict';
// doing an example to test database module
const db = require("../");
const Sequelize = require("sequelize");
const chalk = require("chalk");

async function run()
{
    const config = {
        database: process.env.DB_NAME || 'senseversedb',
        username: process.env.DB_USER || 'senseversedb',
        password: process.env.DB_PASS || 'senseversedb',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        operatorsAliases: Sequelize.Op
    }

    const { Agent, Metric } = await db(config)
        .catch(handleFatalError);

    // creating an agent
    const agent = await Agent.createOrUpdate(
        {
            uuid: 'xxx',
            name: 'testing',
            username: 'test',
            hostname: 'test',
            pid: 1,
            connected: true
        }
    )
        .catch(handleFatalError);

    // creating other agent
    const agent2 = await Agent.createOrUpdate(
        {
            uuid: 'yyz',
            name: 'testing2',
            username: 'test2',
            hostname: 'test',
            pid: 2,
            connected: true
        }
    )
        .catch(handleFatalError);

    if(agent2) console.log("agent2 done");

    console.log(chalk.white.bgRed.bold(`Agent created is: `));
    console.log(agent);

    // showing all agents available in database
    const agents = await Agent.findAll().catch(handleFatalError);
    console.log(chalk.white.bgRed.bold(`All agents: `));
    console.log(agents);

    // creating metrics
    const metric = await Metric.create(agent.uuid,
    {
        type: 'memory',
        value: '56%'
    })
    .catch(handleFatalError);
    console.log(chalk.white.bgRed.bold(`Metric actually saved: `));
    console.log(metric);

    // all metrics with uuid from agent
    const metrics = await Metric.findByAgentUuid(agent.uuid)
        .catch(handleFatalError);
    console.log(chalk.white.bgRed.bold(`Actual metrics from agent:`));
    console.log(metrics);

    const allMetrics = await Metric
        .findByTypeAgentUuid('memory', agent.uuid)
        .catch(handleFatalError);

    console.log(chalk.white.bgRed.bold("All the metrics: "));
    console.log(allMetrics);
}

function handleFatalError(err)
{
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
}

run();