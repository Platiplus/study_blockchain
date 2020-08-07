//DEPENDENCIES
const http = require('http');
const app = require('./app');
const port = process.argv[2];

const server = http.createServer(app);

server.listen(port);