'use strict';

const agent = {
    id: 1,
    uuid: 'yyy-yyy-yyy',
    name: 'fixture',
    username: 'eduardo',
    hostname: 'test-host',
    pid: 0,
    connected: true,
    createdAt: new Date(),
    updatedAt: new Date()
};

const agents = [
    agent,
    extend(agent, { id: 2, uuid:'yyy-yyy-yyw', connected: false, username: 'chato' }),
    extend(agent, { id: 3, uuid:'yyy-yyy-yyx', connected: true, username: 'test' }),
    extend(agent, { id: 4, uuid:'yyy-yyy-yyz', connected: true, username: 'willy' }),
    extend(agent, { id: 5, uuid:'yyy-yyy-yya', connected: false, username: 'test' })
];

function extend (obj, values)
{
    // to make an agent clone with some changes
    const clone = Object.assign({}, obj);
    return Object.assign(clone, values);
}

// functionality to make testing of our service
module.exports = {
    single: agent,
    all: agents,
    // return users where connected is true
    connected: agents.filter(a => a.connected),
    test: agents.filter(a => a.username === 'test'),
    // return just one element using shift
    byUuid: id => agents.filter(a => a.uuid === id).shift(),
    byId: id => agents.filter(a => a.id === id).shift()
};