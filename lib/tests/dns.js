"use strict"

var dns = require('dns'),
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
    var address;

    dns.resolve4('www.google.com', function (err, host) {
        if (err) throw err;

            dns.lookup()
            dns.reverse(a, function (err, domains) {
                if (err) {
                    console.log('reverse for ' + a + ' failed: ' +
                        err.message);
                } else {
                    console.log('reverse for ' + a + ': ' +
                        JSON.stringify(domains));
                }
            });
        });
    });

    return ms;
};
