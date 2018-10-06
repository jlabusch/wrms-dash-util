var log_debug = require('./log').log_debug;

// Like Promise.all(), but guarantees promises executed sequentially.
//
//  - This function has the same fail-fast behaviour as Promise.all() unless on_error_continue
//    is set, in which case failures just add a null value to the result array.
//  - Inputs are processed starting at index i.
//
// Of course, the big problem with this idea is RAII, and we don't want the later promises
// to start executing until we're ready... so instead of a list of promises, we take in a
// list of inputs and a promise generator function:
//
//      generator(inputs[i]) => Promise
//
// Final resolve() contains a list of all values returned by the sequence's resolution.
function promise_sequence(inputs, generator, i = 0, on_error_continue = false){
    return new Promise((resolve, reject) => {
        if (!inputs){
            log_debug(__filename, `promise_sequence() no inputs`);
            return resolve([]);
        }
        promise_sequence_impl(resolve, on_error_continue ? null : reject, [], inputs, generator, i);
    });
}

exports.promise_sequence = promise_sequence;

exports.ON_ERROR_CONTINUE = true;

function promise_sequence_impl(resolve, reject, values, inputs, generator, i){
    if (i >= inputs.length){
        resolve(values);
        return;
    }
    function next(val){
        values.push(val);
        promise_sequence_impl(resolve, reject, values, inputs, generator, i+1);
    }
    generator(inputs[i]).then(
        next,
        err => {
            if (reject){
                log_debug(__filename, `promise_sequence(${i}) rejecting on error ${err.message || err}`);
                reject(err);
            }else{
                log_debug(__filename, `promise_sequence(${i}) not rejecting on error ${err.message || err}`);
                next(null);
            }
        }
    );
}

