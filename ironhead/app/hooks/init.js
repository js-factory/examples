const path = require('path');
const gateway = require('./gateway/init');

const CONFIG_PATH = path.join(__dirname, '../../config/ease-config');

module.exports = async (app, cb) => {
    try {
        await gateway(CONFIG_PATH);
        cb();
    } catch (e) {
        cb(e);
    }
};
