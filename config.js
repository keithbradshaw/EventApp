const dotenv = require('dotenv');
dotenv.config();
const { createLogger, format, transports } = require('winston');
const DD_ENV = process.env.DD_ENV || 'dev'
const DD_SERVICE = process.env.DD_SERVICE || 'eventapi'
const DD_API_KEY = process.env.DD_API_KEY

const httpTransportOptions = {
    host: 'http-intake.logs.datadoghq.com',
    path: `/api/v2/logs?dd-api-key=${DD_API_KEY}&ddsource=nodejs&service=${DD_SERVICE}&ddtags=env:${DD_ENV}`,
    ssl: true
};

const logger = createLogger({
    level: 'info',
    exitOnError: false,
    format: format.json(),
    transports: [
        new transports.Http(httpTransportOptions),
    ],
});

module.exports = logger;