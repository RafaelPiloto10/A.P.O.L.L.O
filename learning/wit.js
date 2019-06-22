const {
    Wit,
    log
} = require('node-wit');

require('dotenv').config();

const client = new Wit({
    accessToken: process.env.WITAITOKEN,
    logger: new log.Logger(log.DEBUG) // optional
});

console.log(client.message('search tennis on youtube'));