'use strict';

// nodejs module
const EventEmitter =  require("events");

class SenseverseAgent extends EventEmitter
{
    // options come at the moment class is called
    constructor(opts) {
        //calling constructor from extended class
        super();

        // internal reference to options
        this._options = opts;
        // flag to know if timer has been initialized
        this._started = false;
        // interval for sending and receiving data frequency
        this._timer = null;
    }
        connect()
        {

            if (!this._started)
            {
                this._started = true;
                const opts = this._options;
                // notifying the agent is connected
                this.emit('connected');
                this._timer = setInterval(() =>
                {
                    // callback each interval seconds
                    this.emit('agent/message', 'this is a message');
                }, opts.interval);
            }
        }

        disconnect()
        {
            if (this._started) {
                clearInterval(this._timer);
                this._started = false;
                this.emit('disconnected');
            }
        }
}

// can be call as:
// const agent = new SenseverseAgent();
//agent.on('agent/message', console.log);
// agent.emit('agent/message', 'this is a message');
module.exports = SenseverseAgent;