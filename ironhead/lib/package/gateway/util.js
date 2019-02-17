const crypto = require('crypto');

exports.generateKey = (text) => {
    const hash = crypto.createHash('md5');
    hash.update(text);
    return hash.digest('hex');
};
