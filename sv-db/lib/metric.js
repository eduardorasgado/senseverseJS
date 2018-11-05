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
        return MetricModel.findAll(joinbyAgent);
    }

    // looking for all metrics filtering by agent and type

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
            const result = await MetricMode.create(metric);
            return result.toJSON();
        }
    }
    // should return all the services
    return {
        //
        create,
        findByAgentUuid
    };
};