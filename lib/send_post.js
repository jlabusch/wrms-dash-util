var request = require('request'),
    log     = require('./log').log;

function SendState(opt){
    this.options = opt;
    this.next = null;
    this.data = null;
}

SendState.prototype.with = function(d){
    this.data = d;
    return this;
}

SendState.prototype.then = function(f){
    this.next = f;
    return this;
}

module.exports = function(options){
    let s = new SendState(options);
    process.nextTick(() => { do_send(s); });
    return s;
}

function do_send(state){
    if (!state.options){
        return;
    }
    state.options.json = true;
    state.options.body = state.data || {};
    state.next = state.next || function(){};

    request.post(
        state.options,
        (err, res, body) => {
            if (err){
                state.next(err);
                return;
            }

            if (res.statusCode >= 400){
                state.next(new Error(`${__filename} failed with ${res.statusCode}`));
                return;
            }

            if (res.statusCode == 200){
                try{
                    state.next(
                        body.error ? new Error(body.error) : null,
                        body.result || {}
                    );
                }catch(ex){
                    log(__filename, 'ERROR: ' + ex);
                    state.next(ex);
                }
                return;
            }

            state.next(new Error(`${__filename} unhandled response ${res.statusCode}`));
        }
    );
}



