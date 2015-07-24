"use strict"

var ping = require('net-ping');

module.exports = function(host, options) {
    console.log('ping '+host);
    console.log(options);
    return 0.1;
};
