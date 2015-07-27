"use strict";
var dns = require('dns'),
    merge = require('merge'),
    Promise = require("bluebird");

module.exports = function(host, testData) {
    return new Promise(function(resolve, reject) {
        return dns.lookup(host, function(err, addresses, family) {
            if (err) {
                return reject(err);
            }

            return(resolve([addresses, family]));
        });
    })
};
