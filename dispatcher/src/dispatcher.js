const express = require('express');
const Redis = require('ioredis');
const fetch = require('node-fetch');
const fs = require('fs');
const cache = require("./cache")

const REDIS_HOST = process.env.REDIS_HOST || "localhost"
const REDIS_PORT = process.env.REDIS_PORT || "6379"
const WORKER_URL = process.env.WORKER_URL || "http://localhost:3000"

const redis = new Redis(REDIS_HOST, REDIS_PORT);
const subscriber = new Redis(REDIS_HOST, REDIS_PORT);
const app = express();

subscriber.subscribe('fibonacci', (err, count) => {
    console.log(`Successfully subscribed to ${count} redis channels`)
})

subscriber.on('message', (channel, message) => {
    console.log(`Receive for ${channel} : ${message}`)
    if (channel === 'fibonacci') {
        data = JSON.parse(message)
        cache.set(data.input, data.result)
    }
})

app.get('/fibonacci', (req, res) => {
    const input = Number(req.query.ask)
    Promise.resolve(cache.get(input))
        .then(value => value == null ? fetch(`${WORKER_URL}/fibonacci?input=${input}`).then(payload => payload.json()) : {'input': input, 'result':value, 'worker':'cache'})
        .then(({result, worker}) => {
                res.json(result)
                redis.sadd(req.headers['x-forwarded-for'] || req.connection.remoteAddress, JSON.stringify({'time': Date.now(),'worker': worker, 'input': input, 'fibonacci': result}))
            })
        .catch(err => {
            console.error(err)
            res.status(500)
            res.json({"error": err})
        })
})

app.get('/history', (req, res) => {
    redis.smembers(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
        .then(data => data.map(input => JSON.parse(input)))
        .then(data => res.send(data))
        .catch(err => {
            console.error(err)
            res.status(500)
            res.json({"error": err})
        })
})

app.get('/status', (req, res) => res.json({"Status": "Ok"})) 

app.listen(3000, function () {
  console.log('Fibonacci dispatcher is available');
});


process.on('SIGTERM', () => {
    console.log("Shutting down dispatcher")
    cache.save()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err)
            process.exit(128)
        })
});