const session = require('./session');
const static = require('./static');
const gateway = require('./gateway');

module.exports = {
    static,
    gateway,
    ...session
};
