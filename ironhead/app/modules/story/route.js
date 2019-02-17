const { gateway } = require('./gatewayConfig');

module.exports = {
    domain: 'article',
    identifier: 'article',
    method: 'GET',
    url: '/',
    responseType: 'html',
    template: 'article',
    gateway
};
