"use strict";
var nconf = require('nconf'),
    crontab = require('node-crontab'),
    monitor = require('./lib/monitor');

var app = this;

var conffile = null;

var argv = process.argv.slice(2);

if(argv.length)
    conffile = argv.pop();

nconf.argv()
    .env()
    .file({ file: conffile })
    .load();

var tests = nconf.get('tests');

// die without tests
if(typeof tests == 'undefined') {
    console.error('NO TESTS FOUND');
    process.exit(-1);
}

var renderCheck = function(res, testdata) {
    if(typeof testdata.checks == 'function') {
        // custom checker, not MSint based...
        return testdata.checks(res);
    } else {
        // should be an array
        return defaultCheck(res, testdata);
    }
};

var defaultCheck = function(res, testdata) {
    if(res<0) {
        return('ERROR');
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

tests.forEach(function(testdata) {
    // do them at at boot -- so we have data for our UI... before the cron goes off...
    monitor(testdata)
        .then(function(res) {
            console.log('first test res: '+res+" "+renderCheck(res, testdata));
            // and schedule again....
            testdata.jobId = crontab.scheduleJob(testdata.cron, function(testdata){
                console.log('testTime');
                monitor(testdata)
                    .then(function(res){
                        console.log('schedlued test res: '+res+" "+renderCheck(res, testdata));
                    })
                    .then(function() {
                        console.log('end of testTime');
                    });
            }, [testdata], app);

            console.log(testdata.name+" scheduled as jobId "+testdata.jobId);
        }
    );
});
