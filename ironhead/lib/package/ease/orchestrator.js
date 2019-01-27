/**
 **********************************NOMENCLATURE**********************************
 *
 * EaseConfig - Config in which all the API configs exists.
 * It is passed by the application in the path provided.
 *
 * Request Config - Config passed by the model
 *
 * Server Configs - Config in which all the server host,port and protocol exists.
 ********************************************************************************
 *
 */

/**
 * This module is build for orchestrating the ease modules like
 * transporter, urlBuilder, headerBuilder.
 */

const R = require('ramda');
const configLoader = require('./config-loader');
const configStore = require('./config-store');
const debug = require('debug');
const urlBuilder = require('./url-builder');
const transporter = require('./transporter');
const headerBuilder = require('./header-builder');

const isEmpty = (obj) => !Object.keys(obj).length;

/**
 * This function is used to initialise the configs
 * @param {*} configs
 */
const init = (configs) => {
    configStore.init(configs);
};


/**
 * This particular function is used to set the fixtures Path for EASE.
 * It must contain the API configs and optional : Server, External API and Header Configs
 * @param {*} configsPath - Path to the configs
 */
const fixtures = async (configsPath) => {
    if (!configsPath || typeof configsPath !== 'string') {
        throw new Error('ConfigsPath not defined');
    }
    try {
        const configs = await configLoader.getConfigs(configsPath);
        init(configs);
        return true;
    } catch (err) {
        throw err;
    }
};

/**
 * This function is used to set Key in ease config.
 */
const setKeyInEaseConfig = (requestConfig) =>
    (easeConfig) =>
        R.set(R.lensProp('key'), R.propOr(requestConfig, 'key', easeConfig), easeConfig);

/**
 * This function is used to obtain ease config by passing requestConfig
 */
const getEaseConfig = (requestConfig) =>
    R.pipe(
        configStore.getEaseConfig.bind(configStore),
        setKeyInEaseConfig(requestConfig)
    )(requestConfig);

/**
 * This function is used to get Server Config by passing ease config
 */
const getServerConfig = R.pipe(
    R.prop('options'),
    R.propOr('', 'server'),
    configStore.getServerConfig.bind(configStore)
);

/**
 * This function is used to get Headers from Ease Config
 */
const getHeadersFromEaseConfig = R.pipe(
    R.prop('options'),
    R.propOr({}, 'headers')
);

/**
 * This function is used to obtain headers from Header builder module.
 * @param {*} easeConfig - Ease Config
 * @param {*} props - Properties send to header builder to execute the function
 *  injections in the ease/header configs
 */
const getHeaderFromHeaderBuilder = (easeConfig, props) =>
    headerBuilder.get(
        getHeadersFromEaseConfig(easeConfig),
        configStore.getHeaderConfig(),
        props
    );

/**
 * This function is used to create an option for transporter
 * requestConfigKey: default key to store the response if no key
 * is specificed in ease config
 * @param {Onject} headers - Request Headers
 * @param {Object} props - Specific properties which can be used by headers/general config
 */
const getRequiredOptions = (props) =>
    (requestConfigKey) => {
        const { apiTimeout = 10000, ...rest } = props;
        const easeConfig = getEaseConfig(requestConfigKey);
        const { timeout: apiTimeoutConf } = easeConfig;
        const timeout = apiTimeoutConf || apiTimeout;
        const options = urlBuilder.get(
            easeConfig,
            getServerConfig(easeConfig),
            rest
        );

        debug("headerbuilder")("Header Builder", "props for Header config", props, "Request Headers");
        const updatedHeaders = getHeaderFromHeaderBuilder(easeConfig, props);
        debug("headerbuilder")("Header Builder Response", updatedHeaders);

        return {
            ...options,
            timeout,
            headers: updatedHeaders
        };
    };

/**
 * This function is used to obtain an array of options for transporter
 * @param {*} headers
 */
const createConfigForTransporter = (props) =>
    R.map(getRequiredOptions(props));

/**
 * This function is used to structure the configs as required by the
 * modules
 * @param {*} configs
 */
const structureConfigs = (configs) =>
    (Array.isArray(configs) ? configs : [configs]);

/**
 * This function is used to get the data from the orchestrated modules
 * 1. URL Builder
 * 2. Header Builder
 * 3. Transporter
 * @param {*} configs
 * @param {*} headers
 * @param {*} props
 */
const get = (configs, props) => {
    const arrayConfigs = structureConfigs(configs);
    const { debug = false, maxRetries = 3 } = props;
    return R.pipe(
        createConfigForTransporter(props),
        transporter.fetch(debug, maxRetries)
    )(arrayConfigs);
};

module.exports = {
    get,
    fixtures
};
