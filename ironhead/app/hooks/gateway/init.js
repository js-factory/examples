const { fixtures, get } = require('../../../lib/package/ease/orchestrator');
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
    if (!fixturesPath) throw new Error('Fixtures Path for Gateway initalization not passed.');
    const configPath = fixturesPath;
    global.easeDispatch = get;
    return fixtures(configPath);
};

module.exports = init;
