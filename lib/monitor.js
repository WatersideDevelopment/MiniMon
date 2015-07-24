"use strict"

var ping = require('./tests/ping');

module.exports = function(testdata) {
    switch (testdata.type) {
        case 'ping':
            console.log(testdata);
            return ping(testdata.host, testdata);
        default:
            console.error('unknown test type');
    }
};
