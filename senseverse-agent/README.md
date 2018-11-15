# Senseverse-Agent Module
This module works by connecting to MQTT client to publish metrics when agent is connected and to receive MQTT information other agents report.

## Usage
```js
const SenseverseAgent = require('SenseverseAgent');

const agent = new SenseverseAgent({
    // each two seconds it will send a message
    interval: 2000
});

agent.connect();

agent.on('agent/message', payload => {
    console.log(payload);
});

setTimeout(() => agent.disconnect(), 20000);
```
̣