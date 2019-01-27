/**
 * @description
 * This function is used to check if the passed val is an Object.
 * @param {object} val - Variable that needs to be checked
 * @returns {boolean} true if val is object
 */
const isObject = (val) =>
    (Object.prototype.toString.call(val) === '[object Object]');

module.exports = {
    isObject
}
