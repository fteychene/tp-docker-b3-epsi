const Rx = require('rx')
const express = require('express')
const Redis = require('ioredis')

const REDIS_HOST = process.env.REDIS_HOST || "localhost"
const REDIS_PORT = process.env.REDIS_PORT || "6379"

const redis = new Redis(REDIS_HOST, REDIS_PORT);
const app = express();


const fibonacciEvent = new Rx.Subject();

redis.subscribe('fibonacci', (err, count) => {
    console.log(`Successfully subscribed to ${count} redis channels`)
})

redis.on('message', (channel, message) => {
    console.log(`Receive for ${channel} : ${message}`)
    if (channel === 'fibonacci') fibonacciEvent.onNext(JSON.parse(message))
})

app.get('/fibonacci', (req, res) => {
    res.writeHead(200, {
    	'Content-Type': 'text/event-stream',
    	'Cache-Control': 'no-cache',
    	'Connection': 'keep-alive'
    });
    fibonacciEvent.takeUntil(Rx.Observable.fromEvent(req, 'close')).subscribe(
        ({input, result, worker, computation}) => res.write(`data: Computed fibonacci for ${input} = ${result} on worker ${worker} in ${computation} ms\n`),
        err => console.error(err),
        () => console.log("Closing subscription")
    )})

app.listen(3000, function () {
  console.log('Fibonacci monitor is available');
});