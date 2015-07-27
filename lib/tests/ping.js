"use strict"

var ping = require('net-ping'),
    dns = require('./dns'),
    merge = require('merge'),
    Promise = require('bluebird');

// Default options
var defaultOptions = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 64, // too small bounces on some networks, 64 seems saneish...
    retries: 1,
    timeout: 3000,
    ttl: 32
};

module.exports = function(host, testData) {
    return new Promise(function(resolve, reject){
        /* Override any session id that we have by mistake
         * -- we need to be unique as many test can go off at once.
         */
        var options = merge(true, testData.options, defaultOptions);
        options.sessionId = Math.floor(Math.random() * (process.pid % 65535));

        var session = ping.createSession(options);
        var ms = -1;
        return dns(host).then(function(dnsData) {
            var addresses = dnsData[0];
            if(typeof addresses == 'object') {
                addresses = addresses[0];
            }

            return session.pingHost(addresses, function (error, target, sent, rcvd) {
                ms = rcvd - sent;
                if (error) {
                    console.error(error);
                    reject((testData.checks[1]) + 99999999);
                }
                else {
                    resolve(ms);
                }
            });
        });
    });
};
