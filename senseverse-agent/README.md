# Senseverse-Agent Module

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