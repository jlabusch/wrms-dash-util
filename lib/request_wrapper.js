var got = require('got');

async function request(options, handler){
    try {
        const response = await got(options);
        let body = response.body;
        if (typeof(body) === 'string' && body[0] === '{'){
            body = JSON.parse(body);
        }
        handler(
            null,
            response,
            body
        )
    } catch (err){
        handler(err);
    }
}

module.exports = request;
