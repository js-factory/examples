const orchestrator = require('./orchestrator');

module.exports = ((nock) =>
    (nock ? easeNock : orchestrator)
)(global.NOCK);
