var get_dash_context = require('./context'),
    log = require('./log').log,
    restify = require('restify');

'use strict';

var server = null;

module.exports = {
    create: function(name, versions){
        const GENERIC_ERROR = {error: 'Service interruption - please try again later'};

        server = restify.createServer({
            name: name,
            versions: versions
        });

        server.use(function _cors(req, res, next){
            res.setHeader('Access-Control-Allow-Origin', '*');
            let m = req.headers['access-control-request-method'];
            if (m)  res.setHeader('Access-Control-Allow-Methods', m);
            let h = req.headers['access-control-request-headers'];
            if (h)  res.setHeader('Access-Control-Allow-Headers', h);
            return next();
        });

        server.use(restify.bodyParser({mapParams: true}));
        server.use(restify.queryParser({mapParams: true}));

        server.on('uncaughtException', (req, res, route, err) => {
            log(__filename, err.stack);
            res.send(500, GENERIC_ERROR);
        });

        return server;
    },
    setup: function(method, func, handler){
        let path = ':org/:sys/:period';

        server.opts('/api' + func + '/' + path, preflight);

        server[method]('/api' + func + '/' + path, function(req, res, next){
            let ctx = get_dash_context(req);

            if (ctx.error){
                log(__filename, 'get_dash_context: ' + ctx.error);
                res.json({error: ctx.error});
                return;
            }

            handler(req, res, next, ctx);
        });
    },
    main: function(port, then){
        server.listen(port, function(err){
            if (err){
                throw err;
            }
            log(__filename, `${server.name} listening at ${server.url}`);
        });
        then && then();
    }
};

function preflight(req, res, next){
    res.send(200);
    return next();
}

