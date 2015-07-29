"use strict";
var dns = require('dns'),
    merge = require('merge'),
    Promise = require("bluebird");

module.exports = {
    test: function(testData) {
        var host = testData.host;
        return new Promise(function (resolve, reject) {
            return dns.lookup(host, function (err, addresses, family) {
                if (err) {
                    return reject(err);
                }

                return (resolve([addresses, family]));
            });
        })
    }
};
