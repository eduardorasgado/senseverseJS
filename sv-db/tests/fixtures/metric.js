'use strict';
const agentFixtures = require("./agent");

// metric fixture to make metric testing

const metric = {
    id: 1,
    agentId: 1,
    type: "test",
    value: "46%",
    createdAt: new Date(),
    agent: agentFixtures.byId(1)
}

const metrics = [
    metric,
    extendMetrics(metric, {id: 2,type: "test2", value: "100%", agent: agentFixtures.byId(2)}),
    extendMetrics(metric, {id: 3, agentId: 2, type: "original", value: "88%", agent: agentFixtures.byId(5)}),
    extendMetrics(metric, {id: 4, agentId: 2, type: "altitude", value: "+43m", agent: agentFixtures.byId(2)}),
    extendMetrics(metric, {id: 5, agentId: 3, type: "pressure", value: "12%", agent: agentFixtures.byId(3)}),
    extendMetrics(metric, {id: 6, type: "gyroscope", value: "45,-1,150"}),
]

// a way to clone the objects
function extendMetrics(obj, values)
{
    const metricClone = Object.assign({}, obj);
    return Object.assign(metricClone, values);
}

function findByAgentUuid (uuid) {
    return metrics.filter(m => m.agent ? m.agent.uuid === uuid : false).map(m => {
        const clone = Object.assign({}, m)

        delete clone.agent

        return clone
    })
}

module.exports = {
    metric: metric,
    all: metrics,
    //byUuid: id => metrics.filter(m => m.agentId == id).shift(),
    findByAgentUuid
}