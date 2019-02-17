const Redis = require('ioredis');
Redis.Promise = require('bluebird')
 
let connection;

module.exports = {
    init() {
        if (connection) {
            return Promise.resolve(connection);
        }
        return new Promise((resolve, reject) => {
            connection = new Redis();
            connection.set('testRedisConnection', 'test data');
            connection.get('testRedisConnection', function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    if (data === 'test data') {
                        resolve(connection);
                    }
                }
            });
        });
    },
    getConnection() {
        return connection;
    }
};
