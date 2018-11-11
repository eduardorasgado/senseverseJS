'use strict';

const debug = require('debug')('platziverse:mqtt');
const mosca = require('mosca');
const redis = require('redis');
const chalk = require('chalk');
const db = require("sv-db");
const configModule = require("../config/configDB");
const { parsePayload } = require("./utils");

const backend = {
    type: 'redis',
    redis,
    // redis property to be able to return buffers
    return_buffers: true
}

const settings = {
    port: 1883,
    backend
};

//postgres database
const config = configModule.configDB(false, false, false);

// mosca server
// event emitter
const server = new mosca.Server(settings);
// ot be able to save all messages from mqtt and do the relations with agent and metric models
// data will be stored in postgresql db
const clients = new Map();

let Agent, Metric = null;

server.on('clientConnected', client =>
{
    // id is automatically created by mosca server
    debug(`${chalk.red.bold("Client Connected")}: ${client.id} `);
    // 
    clients.set(client.id, null);
});

server.on('clientDisconnected', client =>
{
    debug(`${chalk.red.bold("Client disconnected:")} ${client.id}`);
});

// what is the packet and who sent it
server.on('published', (packet, client) =>
{
    // topic is message type
    debug(`Received: ${packet.topic}`);
    
    switch (packet.topic) {
        case 'agent/connected':
            //
        case 'agent/disconected':
            // payload is where pkg info is stored
            debug(`[Payload]: ${chalk.green.bold(packet.payload)}`);
            break;
        case 'agent/message':
            debug(`[Message]: ${chalk.green.bold(packet.payload)}`);
            // here is where payload json with metric and agent info is handle
            //console.log("payload heeere...");
            const payload = parsePayload(packet.payload);
            if(payload)
            {
                //
            }
            break;
    }
});

/*
* Testing the server with:
* npm run start-dev
* and(having installed a mqtt client, you can use mqtt in npm):
*  mqtt pub -t 'agent/message' -h 'localhost' -m  'hola ya tienes las copias?'
* */
server.on('ready', async () =>
{
    // once MQTT server is ready, then services in database are brought
    const services = await db(config)
        .catch(handleFatalError);

    // be able to connect to services in sv-db module
    Agent = services.Agent;
    Metric = services.Metric;

    console.log(`${chalk.green.bold('[platziverse-mqtt]')} server is running.`);
});

server.on('error', handleFatalError);

// HANDLERS

// in case a service failure
function handleFatalError(err)
{
    console.error(`${chalk.white.bgRed.bold("[Fatal Error]")} ${err.message}`);
    console.error(err.stack);
    process.exit(1);
}

// in case another error occurs but not inside the service
process.on('uncaughtException', handleFatalError);
// when we do not handle a promise rejection
process.on('unhandledRejection', handleFatalError);