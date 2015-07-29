"use strict";
var nconf = require('nconf'),
    crontab = require('node-crontab'),
    monitor = require('./lib/monitor');

var renderCheck = function (res, testdata) {
    if (typeof testdata.checks == 'function') {
        // custom checker, not MSint based...
        return testdata.checks(res);
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

var minimon = {
    tests: undefined,
    app: function(conffile) {
        nconf.argv()
            .env()
            .file({file: conffile})
            .load();

        minimon.tests = nconf.get('tests');

        // die without tests
        if (typeof minimon.tests == 'undefined') {
            console.error('NO TESTS FOUND');
            process.exit(-1);
        }

        minimon.tests.forEach(function (testdata) {
            // do them at at boot -- so we have data for our UI... before the cron goes off...
            monitor(testdata)
                .then(function (res) {
                    testdata.res = res;
                    testdata.state = renderCheck(res, testdata);
                    console.log('first test res: ' + testdata.res + " " + testdata.state);
                    // and schedule again....
                    testdata.jobId = crontab.scheduleJob(testdata.cron, function (testdata) {
                        console.log('testTime');
                        monitor(testdata)
                            .then(function (res) {
                                testdata.res = res;
                                testdata.state = renderCheck(res, testdata);
                                console.log('scheduled test res: ' + testdata.res + " " + testdata.state);
                            })
                            .then(function () {
                                console.log('end of testTime');
                            });
                    }, [testdata], minimon.app);

                    console.log(testdata.name + " scheduled as jobId " + testdata.jobId);
                }
            );
        });
    }
};

module.exports = minimon;
