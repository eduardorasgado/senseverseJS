/*
* Services for agent model
* */
'use strict';

module.exports = function setupAgent(AgentModel)
{
    async function createOrUpdate(agent)
    {
        // in case agent exist it wll be updated
        // if agent doest not exist it is created
        const cond = {
            where: {
                uuid: agent.uuid
            }
        };
        // findOne is a Sequelizer method to take first
        // object a search finds
        const existingAgent = await AgentModel.findOne(cond);
        if(existingAgent)
        {
            const updated = await AgentModel.update(agent, cond);
            // if updated is done then return from database
            // (not from the object created), otherwise
            // return the existing agent
            return updated ? AgentModel.findOne(cond) : existingAgent
        }
        // if agent does not exist then create it
        const result = await AgentModel.create(agent);
        return result.toJSON();
    }
    //
    function findById(id)
    {
        //this produces a bug in our test
        //id = id + 1;

        // wrapper
        return AgentModel.findById(id);
    }

    return {
        createOrUpdate,
        findById
    };
};