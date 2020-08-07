# PlatChain

This project is about implementing a personal blockchain for study purposes.
It contains:
- Proof Of Work
- Hashing algorithms
- Ability to create and mine blocks and also store transactions in blocks
- Broadcast system
- Consensus algorithms implementing the longest chain rule
- API server to interact with the blockchain

### Clone the repository
    git clone git@github.com:Platiplus/PlatChain.git

The nodes are hosted on localhost:3000 to localhost:3004  
Feel free to alter the ports on package.json file

### Run the nodes
    npm start
    npm run node_1
    npm run node_2
    npm run node_3
    npm run node_4

### Post example to Register and Broadcast nodes into the network
    http://localhost:3000/api/blockchain/node/register-broadcast
    
    Body:
    {
	    "newNodeUrl":"http://localhost:3004"
    }

### Post example to create a new transaction and broadcast into the network
    http://localhost:3000/api/blockchain/transaction/create-broadcast
    
    Body:
    {
	    "value": 100,
	    "senderAddress": "D6FCC1345196F834DBCF5D8DCA89CD5B27FB9CB9E454B99FDFBB25F35E64E223",
	    "recipientAddress": "03BF41E056CE4FC76ECD543581808283A1B49AE5788C9206768AF17FC4EDBA25"
    }

### Entire Chain
    http://localhost:3000/api/blockchain/check

### Mine a new block
    http://localhost:3000/api/blockchain/block/mine
    
### Consensus example
    http://localhost:3000/api/blockchain/consensus
    
### GUI Block Explorer to get Blocks, Addresses and Transactions Data
    http://localhost:3000/explorer