"use strict";
var nconf = require('nconf'),
    minimon = require('./embedded');

var app = this;

var conffile = null;

var argv = process.argv.slice(2);

if(argv.length)
    conffile = argv.pop();

return minimon(conffile);