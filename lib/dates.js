var log = require('./log');

// Normalise 2018-05 to 2018-5
exports.parse_period = function(str){
    let r = null,
        m = str.match(/^(\d\d\d\d)-0?(\d\d?)/);
    if (m){
        r = {
            period: str.replace(/-0/, '-'),
            year: parseInt(m[1]),
            month: parseInt(m[2])
        }
    }else{
        log.log_debug(__filename, 'parse_period: "' + str + '" failed');
    }
    return r;
}

// Format a Date as YYYY-M?M (matches format of parse_period)
function date_fmt(d, force_leading_zero = false){
    if (!d){
        return '';
    }
    let month = d.getMonth() + 1;
    if (force_leading_zero && month < 10){
        month = '0' + month;
    }
    return d.getFullYear() + '-' + month;
}

exports.date_fmt = date_fmt;

// Return a standard format period for "now"
exports.current_period = function(){
    let now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth()+1;
    return {
        year: year,
        month: month,
        period: date_fmt(now)
    };
}

function next_period_obj(context){
    let y = context.year,
        m = context.month + 1;
    if (m > 12){
        m = 1;
        y++;
    }
    let r = {year: y, month: m, period: y + '-' + m};
    return r;
}

exports.next_period_obj = next_period_obj;

function next_period(context){
    return next_period_obj(context).period;
}

exports.next_period = next_period;

