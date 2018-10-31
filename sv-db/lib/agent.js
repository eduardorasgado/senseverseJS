/*
* Services for agent model
* */
'use strict';

module.exports = function setupAgent(AgentModel)
{
    //
    function findById(id)
    {
        //this produces a bug in our test
        //id = id + 1;

        // wrapper
        return AgentModel.findById(id);
    }

    return {
        findById
    };
};