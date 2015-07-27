"use strict"

var ping = require('net-ping'),
    merge = require('merge');

// Default options
var defaultOptions = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 1,
    timeout: 3000,
    ttl: 128
};

module.exports = function(host, options) {
    /* Override any session id that we have by mistake
     * -- we need to be unique as many test can go off at once.
     */


    options.sessionId= Math.floor(Math.random() * (process.pid % 65535));

    var session = ping.createSession (options);
    session.pingHost (targets[i], function (error, target) {
        if (! error) {
            console.log (target);
            session.close ();
        }
    });
    return 0.1;
};
