"use strict"

var ping = require('net-ping'),
    dns = require('./dns'),
    merge = require('merge');

// Default options
var defaultOptions = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 64, // too small bounces on some networks, 64 seems saneish...
    retries: 1,
    timeout: 3000,
    ttl: 32
};

module.exports = function(host, testData) {
    /* Override any session id that we have by mistake
     * -- we need to be unique as many test can go off at once.
     */
    var options = merge(true, testData.options, defaultOptions);
    options.sessionId = Math.floor(Math.random() * (process.pid % 65535));

    console.log(defaultOptions);
    console.log(options);

    var session = ping.createSession(options);
    var ms = -1;
    session.pingHost(host, function (error, target, sent, rcvd) {
        ms = rcvd - sent;
        if (error) {
            console.log(error);
            console.error('PING ERROPR)');
            return (testData.checks[1])+99999999;
        }
        else {
            console.log('PING WORKS');
            console.log(ms);
            return ms;
        }
    });
    return ms;
};
