'use strict';

// nodejs module
const EventEmitter =  require("events");

class SenseverseAgent extends EventEmitter
{
    //
    constructor()
    {
        //calling constructor from extended class
        super();
    }
}

// can be call as:
// const agent = new SenseverseAgent();
//agent.on('agent/message', console.log);
// agent.emit('agent/message', 'this is a message');
module.exports = SenseverseAgent;