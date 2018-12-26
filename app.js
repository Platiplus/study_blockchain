//DEPENDENCIES
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

//ROUTES IMPORTING
const chain_routes = require('./api/routes/chain_routes');
const explorer_routes = require('./api/routes/explorer_routes');
//MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ROUTES DECLARATION
app.use('/api/platchain', chain_routes);
app.use('/explorer', explorer_routes);

//ERROR 404 HANDLING
app.use((request, response, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

//GENERIC ERROR HANDLING
app.use((error, request, response, next) => {
    response.status(error.status || 500);
    response.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;