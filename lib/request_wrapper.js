var got = require('got');

async function request(options, handler){
    try {
        const response = await got(options);
        console.log('XXX typeof(response.body): ' + typeof(response.body));
        console.log('XXX response.body: ' + response.body);
        handler(
            null,
            response,
            response.body
        )
    } catch (err){
        handler(err);
    }
}

module.exports = request;
