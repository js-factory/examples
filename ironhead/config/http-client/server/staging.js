/**
 * @description
 * It contains the <strong> server configurations </strong> required by the ease
 * for making an API Call.
 *
 * This config will loaded in staging environment
 */

const API_HOST = 'newsapi.org';

const config = {
    api: {
        protocol: 'https',
        server: process.env.API_HOST || API_HOST
    }
};
/**
 * @description
 * This function is used to get this config on the basis of environment.
 * This config will be loaded in staging environment only.
 * <br />
 * @returns { object } Config Object
 */
const getConfig = () => ((process.env.NODE_ENV === 'staging') ? config : {});

module.exports = getConfig();
