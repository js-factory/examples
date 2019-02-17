exports.article = {
    options: {
        server: 'api',
        method: 'get',
        endPoint: '/v2/everything?domains=wsj.com,nytimes.com'
    }
};

exports.gateway = () => (
    {
        ttl: 60,
        type: 'rest',
        cache: true,
        configKeys: ['article']
    }
);