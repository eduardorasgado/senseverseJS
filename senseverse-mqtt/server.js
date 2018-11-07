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

server.on('ready', () =>
{
    console.log(`${chalk.green.bold('[platziverse-mqtt]')} server is running.`);
});

