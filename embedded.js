"use strict";
var Promise = require('bluebird'),
    nconf = require('nconf'),
    crontab = require('node-crontab'),
    monitor = require('./lib/monitor');

var minimon = {
    tests: undefined,
    app: function(conffile, publish) {
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

	if (typeof publish == 'undefined') {
		publish = function(testdata) {
                        console.log('test results for ' + testdata.name + ":" + testdata.res + " " + testdata.state);
		}
	}

	var testCount = 0;
        minimon.tests.forEach(function (testdata) {
            // fingerprint the test....
            testdata.id = testCount;
            // do them at at boot -- so we have data for our UI... before the cron goes off...
            console.log('first test for "' + testdata.name + '":' + JSON.stringify(testdata));
            monitor(testdata)
                .then(function () {
                    publish(testdata);
                    // and schedule again....
                    testdata.jobId = crontab.scheduleJob(testdata.cron, function (testdata) {
                        console.log('scheduled test for "' + testdata.name + '":'  + JSON.stringify(testdata) + " " + testdata.state);
                        monitor(testdata)
                            .then(function () {
                                publish(testdata);
                            })
                            .then(function () {
                                console.log('end of testTime');
                            });
                    }, [testdata], minimon.app);

                    console.log(testdata.name + " scheduled as jobId " + testdata.jobId);
                }
            );
	    testCount++;
        });
    }
};

module.exports = minimon;
