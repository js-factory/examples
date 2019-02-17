const path = require('path');
const httpClient = require('../../lib/package/gateway/httpClient');

const CONFIG_PATH = path.join(__dirname, '../../config/http-client');

module.exports = async (app, cb) => {
    try {
        await httpClient.init(CONFIG_PATH);
        cb();
    } catch (e) {
        cb(e);
    }
};
