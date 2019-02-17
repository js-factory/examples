const httpClient = require('./httpClient');
const cacheClient = require('./cacheClient');

module.exports = async (props) => {
    const { reqConfig, ...gwConfig } = props;
    const { configKeys, cache } = gwConfig;

    try {
        if (cache) {
            const data = await cacheClient.get(gwConfig);

            if (data) {
                console.log('hit');
                const response = JSON.parse(data);
                return response;
            }
            console.log('miss');
            const response = await httpClient.request(props);
            cacheClient.set(gwConfig, response);
            return response;
        } else {
            const response = await httpClient.request(props);
            return response;
        }

    } catch (e) {
        throw e;
    }
};

