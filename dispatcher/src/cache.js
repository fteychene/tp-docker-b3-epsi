const fs = require('fs')
const CACHE = process.env.CACHE || "cache.json"

const localCache = new Map()

exports.save = () => 
    new Promise((resolve, reject) => fs.writeFile(CACHE, JSON.stringify([...localCache].map(([k, v]) => { return {"key": k, 'value': v}}), null, 2), err => err ? reject(err): resolve()))

exports.set = (key, value) => localCache.set(key, value)
exports.get = (key) => localCache.get(key)

console.log("Loading local cache")
fs.readFile(CACHE, (err, data) => err == null ? JSON.parse(data).map(({key, value}) => localCache.set(key, value)) : console.error(`Error loading cache`));

