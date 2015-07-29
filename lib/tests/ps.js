"use strict"

var ps = require('ps-node'),
    Promise = require('bluebird');;

module.exports = function(testData) {
    var command = testData.command;

    return new Promise(function(resolve, reject){
        ps.lookup({
            command: command
        }, function(err, resultList) {
            if (err) {
                reject(err);
            }

            resultList.forEach(function( process ){
                if( process ){
                    resolve(1);
                }
            });
        });

    });
};
