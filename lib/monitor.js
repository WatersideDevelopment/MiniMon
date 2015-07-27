"use strict"

var ping = require('./tests/ping');

module.exports = function(testData) {
    switch (testData.type) {
        case 'ping':
            console.info('monitor via PING:');
            console.info(testData);
            return ping(testData.host, testData);
        default:
            console.error('unknown test type');
    }
};
