'use strict';

// metric fixture to make metric testing

const metric = {
    uuid: "yyy-yyy-yyw",
    type: "test",
    value: "this metric describes how temperature is increasing over the time"
}

const metrics = [
    metric,
    extendMetrics(metric, {type: "test2", value: "me me me"}),
    extendMetrics(metric, {uuid: "yyy-yyy-yyz", type: "original"}),
    extendMetrics(metric, {uuid: "yyy-yyy-yya", type: "altitude"}),
    extendMetrics(metric, {uuid: "yyy-yyy-yyz", type: "pressure"}),
    extendMetrics(metric, {type: "gyroscope", value: "to describe orientation in environment"}),
]

// a way to clone the objects
function extendMetrics(obj, values)
{
    const metricClone = Object.assign({}, obj);
    return Object.assign(metricClone, values);
}

module.exports = {
    metric: metric,
    byUuid: id => metrics.filter(m => m.uuid == id).shift()
}