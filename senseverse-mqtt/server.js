'use strict';

const debug = require('debug')('platziverse:mqtt');
const mosca = require('mosca');
const redis = require('redis');
const chalk = require('chalk');

const backend = {
    type: 'redis',
    redis,
    // redis property to be able to return buffers
    return_buffers: true
}

const settings = {
    port: 1883,
    backend
}

// mosca server
// event emitter
const server = new mosca.Server(settings);

server.on('clientConnected', client =>
{
    // id is automatically created by mosca server
    debug(`${chalk.red.bold("Client Connected")}: ${client.id} `);
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
    // payload is where pkg info is stored
    debug(`[Payload]: ${chalk.green.bold(packet.payload)}`);
});

server.on('ready', () =>
{
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