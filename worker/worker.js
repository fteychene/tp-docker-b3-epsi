
const R = require('ramda');
const express = require('express')
const Redis = require('ioredis');
const os = require("os");

const REDIS_HOST = process.env.REDIS_HOST || "localhost"
const REDIS_PORT = process.env.REDIS_PORT || "6379"

const redis = new Redis(REDIS_HOST, REDIS_PORT);
const app = express();

const fibonacci = (n) => {
    if (n <= 0) return 0
    else if (n == 1) return 1
    else return fibonacci(n-1) + fibonacci(n-2) 
}

const fibonacciOptimized = (n) => R.range(1, n+1).reduce(([a, b]) => [b, a + b], [0, 1])[0];

app.get('/fibonacci', function (req, res) {
    const input = Number(req.query.input)
    console.log(`Compute fibonacci for ${input}`)
    start = Date.now()
    Promise.resolve(fibonacci(input))
        .then(result => {
            redis.publish('fibonacci', JSON.stringify({'input': input, 'result': result, 'worker': os.hostname(), 'computation': Date.now() - start}))
            res.json({'result': result, 'worker': os.hostname()})
        })
        .catch(err => {
            console.error(err)
            res.status(500)
            res.json({"error": err})
        });
});

app.listen(3000, function () {
  console.log('Fibonacci worker is available');
});