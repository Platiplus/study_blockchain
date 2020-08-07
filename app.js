const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const chain_routes = require('./api/routes/chain_routes');
const explorer_routes = require('./api/routes/explorer_routes');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/blockchain', chain_routes);
app.use('/explorer', explorer_routes);

app.use((request, response, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

app.use((error, request, response, next) => {
    response.status(error.status || 500);
    response.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;