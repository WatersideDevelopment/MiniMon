"use strict";
var nconf = require('nconf'),
    minimon = require('./embedded');

var conffile = null;

var argv = process.argv.slice(2);

if(argv.length)
    conffile = argv.pop();

minimon.app(conffile);
