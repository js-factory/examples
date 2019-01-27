const bodyParser = require('body-parser')
    .urlencoded({ extended: false });

const responseFactory = require('./responseFactory');

module.exports = {
    order: [
        'static',
        'cookieParser',
        'bodyParser',
        'csrf',
        'router',
        'responseFactory'
    ],
    bodyParser,
    responseFactory
};
