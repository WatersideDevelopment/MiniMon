var whois = require('whois-available');
 
module.exports = function(domain) {
    whois(domain, function(err, whoisResponse, isAvailable) {
        console.log(domain);
        console.log(whoisResponse);
        console.log(isAvailable);
    });
};
