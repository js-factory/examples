const gateway = require('../../../gateway/article');

module.exports = {
    domain: 'article',
    identifier: 'article',
    method: 'GET',
    url: '/',
    responseType: 'html',
    template: 'article',
    gateway
};
