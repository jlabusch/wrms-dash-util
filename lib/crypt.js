var crypto  = require('crypto');

exports.encrypt = function encrypt(text){
    let cipher = crypto.createCipher('aes-256-ctr', 'timesheet_adjustments'),
        out = cipher.update(text, 'utf8', 'hex');

    out += cipher.final('hex');

    return out;
}

exports.decrypt = function(text){
    let cipher = crypto.createCipher('aes-256-ctr', 'timesheet_adjustments'),
        out = cipher.update(text, 'hex', 'utf8')

    out += cipher.final('utf8');

    return out;
}

