"use strict"

var ps = require('ps-node'),
    Promise = require('bluebird');;

module.exports = {
    test: function(testData) {
        var command = testData.command;

        return new Promise(function (resolve, reject) {
            ps.lookup({
                command: command
            }, function (err, resultList) {
                if (err) {
                    reject(err);
                }

                resultList.forEach(function (process) {
                    if (process) {
                        resolve(resultList.length);
                    }
                });

                resolve(0);
            });

        })
    },

    checks: function (res, testdata) {
        if (res < 0) {
            testdata.state = 'ERROR';
        } else {
            if (res >= 1) {
                testdata.state = 'GREEN';
            } else {
                testdata.state = 'RED';
            }
        }

        return testdata;
    }
};
