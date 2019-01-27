/**
 * @description
 * This module is used to create URL from External configs.
 *
 * <strong>NOMENCLATURE</strong>
 *
 * *EaseConfig* - Config in which all the API configs exists.
 * It is passed by the application in the path provided.
 *
 * *Request Config* - Config passed by the model
 *
 * *Server Configs* - Config in which all the server host,port and protocol exists.
 */

const R = require('ramda');
const querystring = require('querystring');
const debug = require('debug')('urlbuilder');
const util = require('./util');

/**
 * @description
 * This function is used to get Updated Endpoint.
 * It replaces the {<key>} placeholder with the actual value
 * passed by the request config in urlConfig.
 * @param {*} endPoint endPoint passed by the ease config.
 * @param {*} urlConfig urlConfig passed by the request config.
 * @returns {string} It returns the endPoint by replacing all
 * the dynamic keys in the endPoint.
 */
const getEndPointByReplacingKeys = (endPoint, urlConfig) =>
    Object.keys(urlConfig).reduce((updatedEndpoint, key) =>
        (updatedEndpoint.replace(`{${key}}`, urlConfig[key])), endPoint);

/**
 * @description
 * This function is used to get Request url from EaseConfig using urlConfig passed by the
 * application through Request Config.
 * @param {*} endPoint - Endpoint from EaseConfig
 * @param {object} urlConfig URL Config to generate request url.
 * @returns {string} Request/Service URL that needs to be called.
 */
const getRequestUrl = (endPoint, urlConfig) => {
    if (!endPoint) throw new Error('endPoint is mandatory in easeConfig options');
    return (typeof endPoint === 'function' ? endPoint(urlConfig)
        : getEndPointByReplacingKeys(endPoint, urlConfig));

}

/**
 * @description
 * This function is used to generate Host String by using
 * the Server Configs
 * @param {string} protocolVal Protocol http/https
 * @param {string} serverVal - Server/Host Name
 * @param {number} portVal - Port on which the service is running.
 * @returns {string} Host String is returned.
 */
const getHostString = (protocolVal, serverVal, portVal) => {
    const protocol = protocolVal || 'http';
    const server = serverVal || 'localhost';
    const port = portVal || '';

    return (port ? (`${protocol}://${server}:${port}`) : (`${protocol}://${server}`));
};

/**
 * @description
 * This function uses the content passed by the application through
 * request config and based on the type of config returns the
 * query string.
 * @param {*} content - Content passed by the request config for
 * Get Request.
 * @returns {string} It returns the query string from the content
 * passed.
 */
const getQueryFromContent = (content) => {
    switch (typeof content) {
        case 'string':
            return content;
        default:
            return querystring.stringify(content);
    }
};

/**
 * @description
 * This function is used to get the content key from the Request Config
 * passed by the application.
 * @param {object} requestConfig - Config which can contain props to content function
 * or which can contain the content itself.
 * @param {object} content - Content key in Request Config/ Ease config
 * @example
 *      content: { a:1, b:2 }
 * This will append the query in the request url.
 * @returns {object|string} Stringify content if contentType is string
 * else object.
 */
const getContentForGet = (requestConfig, content) => {
    const extractedContent = typeof content === 'function' ?
        content(requestConfig) : requestConfig.content;
    return getQueryFromContent(extractedContent);
};

/**
 * @description
 * This function is used to get the content key from the Request Config
 * passed by the application.
 * @param {object} requestConfig - Config which can contain props to content function
 * or which can contain the content itself.
 * @param {object} content - Content key in Request Config/ Ease config
 * @example
 *      content: { a:1, b:2 }
 * This will send stringify content to the service.
 * @returns {object|string} Stringify content if contentType is string
 * else object.
 */
const getContentForPost = (requestConfig, { content, contentType }) => {
    const { content: data, contentType: dataType } = requestConfig;
    const extractedContent = typeof content === 'function' ? content(requestConfig)
        : data;
    const type = contentType || dataType;
    if (extractedContent) {
        return type === 'string' ? JSON.stringify(extractedContent) : extractedContent;
    }
    return {};
};

/**
 * @description
 * This function is used to get Request Url by appending Query
 * String.
 * @param {*} url - Request URL
 * @param {*} qs - Query String
 * @returns {string} Updated Request URL with Query String
 */
const getUpdatedUrl = (url, qs) =>
    (url.includes('?') ? `${url}&${qs}` : `${url}?${qs}`);

/**
 * @description
 * This function is used to create options for other http method.
 * @param {object} requestConfig - Request Config
 * @param {object} props true/false
 * @returns {object} - Other HTTP Method Options
 */
const createMethodOptions = (requestConfig, props) => {
    const { url, json } = props;
    const key =  json ? 'body' : 'form';
    return {
        url,
        json,
        [key]: getContentForPost(requestConfig, props)
    }
};

/**
 * @description
 * This function is used to create options for GET method.
 * @param {object} requestConfig - Request Config
 * @param {string} url - Request Url
 * @returns {object} - Get Method Options
 */
const createGetOptions = (requestConfig, { url, content }) => {
    const qs = getContentForGet(requestConfig, content);
    return {
        url: qs ? getUpdatedUrl(url, qs) : url
    };
};

/**
 *
 * @description
 * This function is used to get Http Method Options.
 * @param {string} method - HTTP Method
 * @param {object} requestConfig - Request Config
 * @param {object} props - Extra Properties required to create
 * options.
 * @returns {object} Options for Get and other method options.
 */
const getMethodOptions = (method, requestConfig, props) => {
    const httpMethod = R.toLower(method);
    switch(httpMethod) {
        case 'get' : {
            return createGetOptions(requestConfig, props);
        }
        default : {
            return createMethodOptions(requestConfig, props);
        }
    }
}

/**
 * @description
 * This function is used to create/generate options which is the sole purpose
 * of URL Builder
 * @param {object} easeConfig - Ease Config
 * @param {object} serverConfig - Server Config
 * @param {object} requestConfig - Request Config
 * @returns {object} options that needs to be passed to transporter.
 */
const getOptions = (easeConfig, serverConfig, requestConfig) => {
    const [
        options,
        key = ''
    ] = R.props(['options', 'key'], easeConfig);

    const [
        method = 'get',
        auth,
        dontCareVal,
        retry,
        json = false,
        endPoint,
        content,
        contentType
    ] = R.props(['method', 'auth', 'dontcare', 'retry', 'json', 'endPoint', 'content', 'contentType'], options);

    // dontCareVal can be undefined.
    // We won't be sending dontcare if its null or undefined
    const dontcare = R.propOr(dontCareVal, 'dontcare', requestConfig);

    const url = R.concat(
        getHostString(...R.props(['protocol', 'server', 'port'], serverConfig)),
        getRequestUrl(endPoint, requestConfig)
    );

    const methodOptions = getMethodOptions(
        method,
        requestConfig,
        {
            url,
            json,
            content,
            contentType
        }
    );

    const opts = R.reject(R.isNil, {
        auth,
        dontcare,
        key,
        method,
        retry,
        ...methodOptions
    });

    return opts;
}
/**
 * @description
 * This function is used to get/generate the Options for the transporter.
 * @param {array} args - easeConfig, serverConfig, requestConfig
 * @returns {object} options that needs to be passed to transporter.
 */
const get = (...args) => {
    debug("Args Received by Url Builder", args);

    const [easeConfig, serverConfig, requestConfig] = args;

    if (!util.isObject(easeConfig) || !util.isObject(requestConfig))
        throw new Error('Request/External Config not exist');

    if (!Object.keys(easeConfig).length > 0) {
        throw new Error('Ease Config is empty');
    }

    const opts = getOptions(easeConfig, serverConfig, requestConfig);

    debug("Options Generated by Url Builder", opts);

    return opts;
};

module.exports = {
    get
};
