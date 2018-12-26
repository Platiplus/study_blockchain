//DEPENDENCIES
const http = require('http');
const app = require('./app');
//PORTS SELECTION
const ports = [3000, 3001, 3002, 3003, 3004, 3005];

let node_n = 0;

//SERVER CREATION
ports.forEach((port) => {
    const server = http.createServer(app);
    server.listen(port, () => {
        node_n += 1;
        console.log(`PlatChain NODE ${node_n} is running on port: ${port}`);
    });
});