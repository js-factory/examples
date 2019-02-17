const { generateKey } = require('./util');
const { getConnection } = require('../adapter/redis');

const get = async (config) => {
    const key = generateKey(JSON.stringify(config));
    const redis = getConnection();
    const data = await redis.get(key);

    return data;
};

const set = (config, response) => {
    const { ttl } = config;
    const key = generateKey(JSON.stringify(config));
    const redis = getConnection();
    return setTimeout(() => redis.set(key, JSON.stringify(response), 'ex', ttl), 0);
};

module.exports = {
    get,
    set
};
