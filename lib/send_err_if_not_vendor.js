// Used to gate API functions that are never available to clients.
module.exports = function(req, res, next, context, filename){
    if (context.org_name === '__vendor'){
        return false;
    }

    let e = {error: 'Permission denied for users from ' + context.org_name};
    filename = filename || __filename;
    log(filename, e.error);

    if (res){
        res.charSet('utf-8');
        res.json(e);
        next && next(false);
    }
    return e;
}


