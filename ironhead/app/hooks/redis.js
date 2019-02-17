const { init } = require('../../lib/package/adapter/redis');

module.exports = async (app, cb) => {
    try {
        await init();
        cb();
    } catch (e) {
        cb(e);
    }
}; 