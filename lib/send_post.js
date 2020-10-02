var request = require('./request_wrapper'),
    log     = require('./log').log,
    log_debug = require('./log').log_debug;

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

function SendPost(options){
    let s = new SendState(options);
    process.nextTick(() => { do_send(s); });
    return s;
}

SendPost.__test_hook = null;

module.exports = SendPost;

function do_send(state){
    if (!state.options){
        return;
    }
    state.options.json = state.data || {};
    state.options.method = 'POST';
    state.next = state.next || function(){};

    if (SendPost.__test_hook){
        log_debug(__filename, `__test_hook(${JSON.stringify(state.options)})`);
        SendPost.__test_hook(state);
        SendPost.__test_hook = null;
    }

    request(
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
                    console.log('YYY typeof(body): ' + typeof(body));
                    console.log('YYY body: ' + body);
                    body.result = body.result || {};
                    console.log('YYY body.result: ' + body.result);
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



