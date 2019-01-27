/**
 * This module is used to build the headers for the application.
 *
 * <strong>NOMENCLATURE</strong>
 *
 * *headerConfig* -  Header config fixtured by the application
 *
 * *reqHeaders* - Request Headers
 */

const R = require('ramda');

/**
 * @description
 * This function is used to traverse a obj and execute its key
 * if the key is the function or a value.
 * @param {object} obj - Object is passed to the injected funtion
 * This object can be Request Object or any other object and
 * it depends on the using application/client.
 * Traverse will add only valid values in the headers
 * @returns {function} This will return a curried function.
 */
const traverse = (obj) =>
    (objList) => Object.keys(objList).reduce((newObj, key) => {
        const {[key]: objListVal} = objList;
        if (objListVal) {
            switch (typeof objListVal) {
                case 'function': {
                    const val = objList[key](obj || {}, key);
                    if (val) newObj[key] = val; // eslint-disable-line
                    break;
                }
                default:
                    newObj[key] = objListVal; // eslint-disable-line
                    break;
            }
        }
        return newObj;
    }, {});

/**
 * @description
 * This function is used to check if the passed val is an Object.
 * @param {object} val - Variable that needs to be checked
 * @returns {boolean} Checking type of request headers and Header config.
 */
const isObject = (val) =>
    (R.type(val) === 'Object');

/**
 * @description
 * This function is used to merge the headers config into a single
 * object.
 * @param {object} reqHeaders - Request Headers
 * @param {object} headerConfig - Header config
 * @returns {object} Merged Request Headers and Header config.
 */
const merge = (reqHeaders, headerConfig) => {
    if (!isObject(reqHeaders) || !isObject(headerConfig)) {
        return {};
    }
    return R.merge(
        reqHeaders,
        headerConfig
    );
};

/**
 * @description
 * This function is used to get the headers merged and executed by
 * traversing object's each proprty.
 * @param {array} args
 * If a property of a Header Object is a function, two arguments are passed
 * 1st - reqHeaders - Object passed by the application or by default request Headers are passed
 * 2nd - headerConfig - Headers config object which contains the functions or objects.
 * 3rd - props - props which will be sent in the function injection.
 * @returns {object} Merged Request Headers and Header config.
 */
const get = (...args) => {
    const [reqHeaders = {}, headerConfig = {}, props = reqHeaders] = args;
    return R.pipe(
        merge,
        traverse(props)
    )(reqHeaders, headerConfig);
};

module.exports = {
    get
};
