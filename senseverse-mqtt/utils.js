'use strict';

function parsePayload(payload)
{
    // to deliver info we want
    // if payload is a buffer
    if(payload instanceof Buffer)
    {
        // to safely do a json parse from string
        payload = payload.toString('utf8');
    }

    try
    {
        payload = JSON.parse(payload);
    } catch (e) {
        // if error then deliver a empty json
        payload = null;
    }

    return payload;
}

module.exports = {
    parsePayload
}