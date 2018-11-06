// Metric services
'use strict';

module.exports = function setupMetric(MetricModel, AgentModel)
{
    // services

    async function findByAgentUuid(uuid)
    {
        // using a joint to find agent by uuid
        const joinbyAgent =
        {
            attributes: [ 'type' ],
            group: [ 'type' ],
            // include will help us to do the JOIN
            include: [ {
                // query do not have any info
                attributes: [],
                // the join will be through model
                model: AgentModel,
                // join will be filter by uuid
                where: {
                    uuid
                }
            }],
            // return just in json format
            raw: true
        };
        // here we will return metric types
        let result = await MetricModel.findAll(joinbyAgent);
        return result;
    }

    // looking for all metrics filtering by agent and type
    async function findByTypeAgentUuid(type, uuid)
    {
        // creating the filter
        const whatToFilter = {
            // what should be substracted from the found data
            attributes: [ 'id', 'type', 'value', 'createdAt' ],
            // filter by type
            where: {
                type
            },
            // take just 20 objects
            limit: 20,
            order: [['createdAt', 'DESC']],
            // create a join query to agent model
            include: [{
                attributes:[],
                // filter using the agent
                model: AgentModel,
                where: {
                    uuid
                }
            }],
            // to become this query result into a json
            raw: true
        };
        // return the search
        let result = await MetricModel.findAll(whatToFilter);
        return result;
    }


    async function create(uuid, metric)
    {
        // looking for the agent(if exists)
        const agent = await AgentModel.findOne({
            where: { uuid }
        });

        // in case agent is allocated in DB
        if(agent)
        {
            // copying agent id in metric object
            // this is same:
            //metric.agentId = agent.id;
            Object.assign(metric, { agentId: agent.id });
            // allocate metric in database
            const result = await MetricModel.create(metric);
            return result.toJSON();
        }
    }
    // should return all the services
    return {
        //
        create,
        findByAgentUuid,
        findByTypeAgentUuid
    };
};