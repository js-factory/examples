const httpClient = require('./httpClient');
const redis = require('./redis');

const hooks = [
    redis,
    httpClient
];

module.exports = hooks;
