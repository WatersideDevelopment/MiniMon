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

tests.forEach(function(testdata) {
    // do them at at boot -- so we have data for our UI... before the cron goes off...
    monitor(testdata);

    // and schedule again....
    testdata.jobId = crontab.scheduleJob(testdata.cron, function(testdata){
        console.log('testTime');
        console.info(monitor(testdata));
        console.log('end of testTime');
    }, [testdata], app);

    console.log(testdata.name+" scheduled as jobId "+testdata.jobId);
});
