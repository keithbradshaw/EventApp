const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose')

const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')

const validateAuth = require('./middleware/validateAuth')



const API_PORT = process.env.API_PORT || 3000
const MONGO_DB = 'events-db';
const MONGO_PORT = 27017;
const DD_ENV = process.env.DD_ENV || 'dev'
const DD_SERVICE = process.env.DD_SERVICE || 'eventapi'

if (DD_ENV === 'dev') {
    console.log("Running in dev ENV")
    const tracer = require('dd-trace').init({
        env: DD_ENV,
        service: DD_SERVICE,
        logInjection: true
    }
    )
} else {
    console.log(`Running in ${DD_ENV} ENV`)
    //When fully containerised
    require('dd-trace').init({
        hostname: 'datadog-agent',
        env: DD_ENV,
        service: DD_SERVICE,
        logInjection: true

    })
}
const logger = require('./config.js');


const app = express();


app.use(bodyParser.json());

app.use(validateAuth);

//here we tell the schema what the supported queries
// resolvers used to accept forwarded requests
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));
// Connect to Mongoose and set connection variable
const mongoUri = `mongodb://localhost:${MONGO_PORT}/${MONGO_DB}`;
mongoose.connect(
    mongoUri
).then(() => {

    logger.log('info', `Connected to DB. Now running on port ${API_PORT} in ENV ${DD_ENV}`)
    app.listen(3000)
})
    .catch(err => {
        logger.log('error', err)
    })