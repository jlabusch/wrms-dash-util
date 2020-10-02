var got = require('got');

async function request(options, handler){
    try {
        const response = await got(options);
        handler(null, response, response.body)
    } catch (err){
        handler(err);
    }
}

module.exports = request;
