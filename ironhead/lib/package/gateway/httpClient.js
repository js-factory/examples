const { fixtures, get } = require('../ease/orchestrator');
/**
 *
 * @description **init** is the wrapper over ease for initiating the fixtures
 * path.
 * <br />
 *
 * In order to send request using <strong> ease </strong>, we need to initialize
 * the config path, which <strong> ease </strong> keeps it in memory.
 * <br/>
 *
 * Application using <strong> knucklehead </strong>, needs to initialize it in the beginning
 * since fixturing is asynchronous.
 *
 * @param { fixturesPath } fixturesPath - absolute config path needs to be provided.
 * It's not a mandatory field otherwise it will bootstrap using the default EASE_CONFIG_PATH
 * <br />
 * @returns { Promise } Promise - ConfigPath promise is returned
 */
const init = (fixturesPath) => {
    if (!fixturesPath) throw new Error('Fixtures Path for Gateway initialization not passed.');
    const configPath = fixturesPath;
    return fixtures(configPath);
};

const sanitize = (configKeys, response) => {
    const isMulti = configKeys.length > 1;

    if (isMulti) {
        const parsedResponse = configKeys.reduce((acc, key) => {
            const { [key]: { statusCode, body } } = response;
            acc[key] = {
                ...body,
                apiStatusCode: statusCode
            };
            return acc;
        }, {});

        return parsedResponse;
    }
    const [singleKeyName] = configKeys;
    const { [singleKeyName]: { statusCode, body } } = response;
    return {
        ...body,
        apiStatusCode: statusCode
    };
};

const request = async ({ configKeys, reqConfig, handlers }) => {
    const httpResponse = await get(configKeys, reqConfig);
    const parsedResponse = sanitize(configKeys, httpResponse);
    const standardResponse = typeof handler === 'function' ? handler(parsedResponse) : parsedResponse;
    return standardResponse;
}

module.exports = {
    init,
    request
};
