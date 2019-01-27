const session = require('./session');
const static = require('./static');

module.exports = {
    static,
    ...session
};
