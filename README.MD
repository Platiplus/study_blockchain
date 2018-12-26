**<h1>PlatChain</h1>**

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

## The nodes are hosted on localhost:3000 to localhost:3005
## Feel free to alter the ports on server.js file

### Run the nodes

    node server.js

### Post example to Register and Broadcast nodes into the network
    http://localhost:3000/api/platchain/node/register-broadcast
    
    Body:
    {
	    "url":"http://localhost:3005"
    }

### Post example to create a new transaction and broadcast into the network
    http://localhost:3001/api/platchain/transaction/broadcast
    
    Body:
    {
	    "amount": 100,
	    "sender": "D6FCC1345196F834DBCF5D8DCA89CD5B27FB9CB9E454B99FDFBB25F35E64E223",
	    "recipient": "03BF41E056CE4FC76ECD543581808283A1B49AE5788C9206768AF17FC4EDBA25"
    }

### Entire Chain
    http://localhost:3001/api/platchain/check

### Mine a new block
    http://localhost:3001/api/platchain/block/mine
    
### Consensus example
    http://localhost:3005/api/platchain/consensus
    
### GUI Block Explorer to get Blocks, Addresses and Transactions Data
    http://localhost:3001/explorer

The entire blockchain was lead by the instructor [Eric Traub](https://github.com/erictraub) the course is called **[Learn Blockchain By Building Your Own In JavaScript](https://www.udemy.com/share/10085kBUIdcFpaQHg/)**<br/>
<a href="https://www.udemy.com/share/10085kBUIdcFpaQHg/"><img src="https://i.imgur.com/CzdyaiX.png" alt="JavaScript Blockchain Course" width="150px"/></a>
<br/>