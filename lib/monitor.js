"use strict"

var ping = require('./tests/ping'),
    dns = require('./tests/dns'),
    ps = require('./tests/ps');

var doTest = function (monitor, test, testdata) {
    return test.then(function(res) {
        testdata.res = res;
        if (typeof testdata.checks == 'function') {
            // custom checker, not MSint based...
            return testdata.checks(res, testdata);
        } else if (typeof monitor.checks == 'function') {
            // built in checker for custom types (eg: bool)
            return monitor.checks(res, testdata);
        } else {
            // should be an array
            return defaultCheck(res, testdata);
        }
    });
};

var defaultCheck = function (res, testdata) {
    if (res < 0) {
        testdata.state = 'ERROR';
    } else {
        if (res < testdata.checks[0]) {
            testdata.state = 'GREEN';
        } else if (res < testdata.checks[1]) {
            testdata.state = 'AMBER';
        } else {
            testdata.state = 'RED';
        }
    }
    return testdata;
};

module.exports = function(testData) {
    var res;
    switch (testData.type) {
        case 'ping':
            console.info('monitor via PING:');
            console.info(testData);
            return doTest(ping, ping.test(testData), testData);
        case 'ps':
            console.info('monitor via PS:');
            console.info(testData);
            return doTest(ps, ps.test(testData), testData);
        default:
            console.error('unknown test type');
    }
};
