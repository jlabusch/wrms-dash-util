var got = require('got');

async function request(options, handler){
    try {
        const response = await got(options);
        handler(
            null,
            response,
            typeof(response.body) === 'string' ? JSON.parse(response.body) : response.body
        )
    } catch (err){
        handler(err);
    }
}

module.exports = request;
