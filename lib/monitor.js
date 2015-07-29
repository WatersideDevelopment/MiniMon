"use strict"

var ping = require('./tests/ping'),
    dns = require('./tests/dns'),
    ps = require('./tests/ps');

var renderRes = function (monitor, res, testdata) {
    if (typeof testdata.checks == 'function') {
        // custom checker, not MSint based...
        return testdata.checks(res);
    } else if (typeof monitor.checks == 'function') {
        // built in checker for custom types (eg: bool)
        return monitor.checks(res);
    } else {
        // should be an array
        return defaultCheck(res, testdata);
    }
};

var defaultCheck = function (res, testdata) {
    if (res < 0) {
        return ('ERROR');
    } else {
        if (res < testdata.checks[0]) {
            return ('GREEN');
        } else if (res < testdata.checks[1]) {
            return ('AMBER')
        } else {
            return ('RED')
        }
    }
};

module.exports = function(testData) {
    var res;
    switch (testData.type) {
        case 'ping':
            console.info('monitor via PING:');
            console.info(testData);
            return renderRes(ping, ping(testData), testData);
        case 'ps':
            console.info('monitor via PS:');
            console.info(testData)
            return renderRes(ps, ps(testData), testData);
        default:
            console.error('unknown test type');
    }
};
