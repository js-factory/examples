/**
 * This module is used to manage the configs obtained from the fixtures initialised by the
 * application using the ease orchestrator.
 */

const R = require('ramda');
const debug = require('debug')('configstore');
/**
 * Class to store the configs
 * * server configs * *
 * * ease configs * *
 * * header configs * *
 * @class ConfigStore
 */
class ConfigStore {
    init(configs) {
        [
            this.serverConfig,
            this.easeConfig,
            this.headerConfig = {},
            this.abTestConfig = {}
        ] = configs;

        debug("serverConfig", this.serverConfig);
        debug("easeConfig", this.easeConfig);
        debug("headerConfig", this.headerConfig);
        debug("abTestConfig", this.abTestConfig)
    }

    getServerConfig(key) {
        return R.propOr({}, key, this.serverConfig);
    }

    getEaseConfig(key) {
        return R.propOr({}, key, this.easeConfig);
    }

    getHeaderConfig() {
        return R.clone(this.headerConfig);
    }

    getABTestConfig() {
        return R.clone(this.abTestConfig);
    }
}


// Singleton Config Store

const configStore = new ConfigStore();

module.exports = configStore;
