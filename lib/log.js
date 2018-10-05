var basename = require('path').basename;

// Usage: log(__filename, 'hello world');
function log(sourcefile, msg){
    console.log((new Date()).toISOString() + ' ' + basename(sourcefile) + ' | ' + msg);
}

exports.log = log;

function log_debug(sourcefile, msg, force_on){
    if (force_on || process.env['DEBUG']){
        log.apply(this, arguments);
    }
}

exports.log_debug = log_debug;


