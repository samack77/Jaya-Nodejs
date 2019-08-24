const fs = require('fs');
// Function to store log
exports.storeLog = function(req, res, next) {
    let item = `Ip: ${req.ip}, sort: ${req.url.replace('/', '')}.\n`;
    console.log(item);
    
    let stream = fs.createWriteStream("public/assets/log.txt", {flags:'a'});
    stream.once('open', function(fd) {
        stream.write(item);
        stream.end();
    });
    next();
}