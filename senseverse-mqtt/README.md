# Senseverse-MQTT

##  `agent/connected`

```js
{
    agent: {
        uuid, // autogenerate
        username, // difined by settings
        name, // defined by settings
        hostname, // from operating system
        pid // from process
    }
}
```

## `agent/disconnected`

```js
{
    agent: {
        uuid
    }
}
```

## `agent/message`

```js
{
    agent,
    metrics: [{
        type,
        value
    }],
    timestamp // generated when message is created
}
```