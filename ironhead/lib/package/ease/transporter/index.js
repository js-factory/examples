/**
 * @description
 * MAX_HTTP_POOL - Environment variable for setting max socket pool size
 */
const _ = require('lodash');
const Promise = require('bluebird');
const Debug = require('debug')('transporter');
const rp = Promise.promisify(require('request').defaults({
    pool: {
        maxSockets: process.env.MAX_HTTP_POOL || 1000
    },
    gzip: true
}));

/**
 * @description
 * This function is used to get the Logger Instance.
 * @returns {object} - Logger Instance
 */
const getLogger = () =>
    (global.LOGGER && global.LOGGER.log && typeof global.LOGGER.log.info === 'function' &&
    typeof global.LOGGER.log.error === 'function' ? global.LOGGER.log : console);

global.log = global.log || getLogger();

/**
 * @description
 * This function is used to check whether the statusCode is a badStatus
 * or a healthy status to proceed.
 * @param {number} statusCode - Status Code
 * @returns {boolean} true|false if statusCode is acceptable
 * [200, 201, 404, 401, 400]
 */
const isBadStatus = (statusCode) => {
    const regex = new RegExp(/(^2[0-9]{2}$)|(^4[0-9]{2}$)/);
    return !regex.test(statusCode);
};

/**
 * This function is used handle content type JSON.
 * @param {object} body - Response body
 * @returns {object} Parsed Body Response
 */
const handleContentTypeJson = (body) => {
    body = body || {};
    try {
        return typeof body === 'object' ? body : JSON.parse(body);
    } catch (ex) {
        log.error('Transporter->handleContentTypeJson: Not a valid JSON, can\'t parse body', { body: body, error: ex});
        return body;
    }
};

/**
 * @description
 * This function is used to parse the response body based on the response header.
 * <b>Supported Response Header:</b>
 *  1. text/html
 *  2. text/plain
 *  3. application/json
 * @param {object} headers - Response headers
 * @param {*} body - Response body
 * @returns {object} Parsed Response
 */
const parseBody = (headers, body) => {
    const {'content-type' : type = ''} = headers;
    const [ contentType ] = type.split(';');
    switch (contentType) {
        case 'text/html':
        case 'text/plain': {
            return body;
        }
        case 'application/json':
        default: {
            return handleContentTypeJson(body);
        }
    }
};

/**
 * @description
 * This function is used to sanitize the received data.
 * It is also used to attach the debugData
 *
 * @param {*} data - Response Received
 * @param {object} options - Request options
 * @param {boolean} debug Data should be attached.
 * @returns {Promise} Sanitized Response
 */
const sanitizeData = (data, options, debug) =>
    options.reduce((result, option, index) => {
        const { key = index } = option;
        const {[index]: indexedData} = data;
        result[key] = indexedData;
        if (debug) {
            result.debugData = result.debugData || [];
            result.debugData.push({
                APIRequest: option,
                APIResponse: indexedData
            });
        }
        return result;
    }, {});

/**
 * @description
 * This function is used to check whether the request should be retried or not
 * @param {object} option - Request Option
 * @param {number} maxRetries - Max Retries number
 * @returns {boolean} Boolean for retried or not
 */
const shouldRetry = ({ retry = false, retryCount }, maxRetries) =>
    retry && (retryCount <= (maxRetries || 3));

/**
 * @description
 * This function is used to log and handle error response.
 * @param {object} err - Error Response
 * @returns {promise} Error Response promise object
 */
const handleErrResponse = (err) => {
    const { options, statusCode, body, headers } = {...err};
    log.error(
        'Request failed: Options - ',
        options, 'statusCode',
        statusCode,
        'response',
        body
    );

    return Promise.resolve({ statusCode, headers, body });
};

/**
 * @description
 * This particular function needs to be function since we
 * are using requestWithRetry and requestWithRetry will be using
 * handleRetry.
 * @param {object} option Request Option
 * @param {number} maxRetries MaxRetry
 * @param {object} err - Error Object
 * @returns {Promise} Promise to handle retry functionality
 */
function handleRetry(option, maxRetries, err) {
    Debug('Retrying with particular Option', option);

    let { retryCount = 0, dontcare } = option;
    retryCount = retryCount + 1;
    const updatedOption = {
        ...option,
        retryCount
    };
    if (shouldRetry(updatedOption, maxRetries)) {
        return requestWithRetry(updatedOption, maxRetries);
    }

    if (!dontcare) {
        throw err;
    }
    return handleErrResponse(err);
}

/**
 * @description
 * This function is used to send the request with options and retry
 * the request if failed due to network or unacceptable statuses.
 * @param {object} option - Request Option
 * @param {number} maxRetries - Max Retries number
 * @returns {Promise} Promise for sending the HTTP Request.
 */
const requestWithRetry = async (newoption, maxRetries) => {
    const option = _.omit(newoption, ['key']);
    try {
        Debug('Requesting with Option', option);
        const response = await rp(option);
        const { body, statusCode, headers } = response;
        Debug('Response received of option', option, { body, statusCode, headers });
        return isBadStatus(statusCode)
            ? handleRetry(option, maxRetries, response)
            : { statusCode, headers, body: parseBody(headers, body)};
    } catch (err) {
        err.option = option;
        return handleRetry(option, maxRetries, err);
    }
};

/**
 * @description
 * This function is used to fetch data based on the options passed.
 * @param {boolean} debug - Boolean for Attaching the debugData or not.
 * @param {number} maxRetries - No. of Retries for failed Requests
 * @param {object} options - Array of Options for making requests
 * @returns {Promise} Promise HTTP Call.
 */
const fetch = (debug, maxRetries) => (options) => {
    if (!Array.isArray(options)) {
        throw new Error('Transporter->fetch: Options must be an array');
    }
    Debug('Total Request Options Received', options);
    const promises = options.map((option) => requestWithRetry(option, maxRetries));
    return Promise
        .all(promises)
        .then((data) => sanitizeData(data, options, debug));
};

module.exports = {
    fetch
};
