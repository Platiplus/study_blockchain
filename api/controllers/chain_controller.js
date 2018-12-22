//DEPENDENCIES
const PlatChain = require('../models/Platchain');
const request = require('request-promise');  
const uuid = require('uuid/v1'); 

//NEW PLATCHAIN
const PlatCoin = new PlatChain();

//NODE ADDRESS
const nodeAddress = uuid().split('-').join('');

//METHODS DECLARATION

//CHECK THE ENTIRE BLOCKCHAIN
const check_chain = (request, response) => {
    response.status(200).json({error: false, data: PlatCoin});
};
//CREATE A NEW TRANSACTION
const create_transaction = (request, response) => {
    let transaction = request.body;
    try{
        const blockIndex = PlatCoin.addTransactionToPending(transaction);
        response.status(200).json({error: false, data: `Transaction will be added on block ${blockIndex}.`});
    } catch(error) {
        response.status(500).json({error: true, data: error.message});
    }    
};
//BROADCAST A TRANSACTION
const broadcast_transaction = (request, response) => {
    const tr_info = request.body;
    const newTransaction = (tr_info.amount, tr_info.sender, tr_info.recipient);

    PlatCoin.addTransactionToPending(newTransaction);

    const requestPromises = [];

    PlatCoin.networkNodes.forEach((nodeURL) => {
        const requestOptions = {
            uri: nodeURL + '/transaction/create',
            method: 'POST',
            json: true,
            body: newTransaction
        };
        requestPromises.push(request(requestOptions));
    });

    Promise.all(requestPromises)
    .then((data) => {
        response.status(200).json({error: false, data: 'TRANSACTION CREATION AND BROADCASTING ENDED SUCCESSFULLY'});
    })
    .catch((error) => {
        response.status(500).json({error: true, data: error.message});
    })

};
//MINE A NEW BLOCK
const mine_block = (request, response) => {
    const lastBlock = PlatCoin.getLastBlock();

    const previousBlockHash = lastBlock['hash'];
        
    const currentBlockData = {
        transactions: PlatCoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };

    const nonce = PlatCoin.proofOfWork(previousBlockHash, currentBlockData);

    const blockHash = PlatCoin.hashBlock(previousBlockHash, currentBlockData, nonce); 
        
    const newBlock = PlatCoin.createNewBlock(nonce, previousBlockHash, blockHash);

    const requestPromises = [];

    PlatCoin.networkNodes.forEach((nodeURL) => {
        const requestOptions = {
            uri: nodeURL + '/node/receive',
            method: 'POST',
            json: true,
            body: { newBlock }
        };
        requestPromises.push(request(requestOptions));
    });

    Promise.all(requestPromises)
    .then((data) => {
        const requestOptions = {
            uri: PlatCoin.currentNodeURL + '/transaction/broadcast',
            method: 'POST',
            json: true,
            body: {
                amount: 12.5,
                sender: '00',
                recipient: nodeAddress
            }
        };
        return request(requestOptions);
    })
    .then((result) => {
        response.status(200).json({error: false, data: { message: "Block mined and broadcasted successfully!" , block: newBlock}});
    })
    .catch((error) => {
        response.status(500).json({error: true, data: error.message});
    });
};
//REGISTER AND BROADCAST NODE
const registerBroadcastNode = (request, response) => {
    const newNodeURL = request.body.url;
    if (PlatCoin.networkNodes.indexOf(newNodeURL) == -1){
        PlatCoin.networkNodes.push(newNodeURL);
    }

    const registerNodePromises = [];

    PlatCoin.networkNodes.forEach((nodeURL) => {
        const requestOptions = {
            uri: nodeURL + '/node/register',
            method: 'POST',
            json: true,
            body: {
                newNodeURL
            }
        };
        registerNodePromises.push(request(requestOptions));
    });

    Promise.all(registerNodePromises)
    .then((data) => {
        const bulkNodesRegisterOptions = {
            uri: newNodeURL + '/node/register-bulk',
            method: 'POST',
            json: true,
            body: {
                allNetworkNodes: [...PlatCoin.networkNodes, PlatCoin.currentNodeURL]
            }
        };
        return request(bulkNodesRegisterOptions);
    })
    .then((data) => {
        response.status(200).json({error: false, data: {message: 'NEW NODE REGISTERED SUCCESSFULLY', data}});
    })
    .catch((error) => {
        response.status(500).json({error: true, data: error.message});
    });
        
};
//REGISTER A NODE IN THE NETWORK
const registerNode = (request, response) => {
    const newNodeURL = request.body.url;
    const nodeNotPresent = PlatCoin.networkNodes.indexOf(newNodeURL) == -1;
    const nodeNotCurrent = PlatCoin.currentNodeURL !== newNodeURL;

    if(nodeNotPresent && nodeNotCurrent){
        PlatCoin.networkNodes.push(newNodeURL);
    }
    response.status(200).json({error: false, data: 'NEW NODE REGISTERED SUCCESSFULLY'});
};
//REGISTER NODES BULK
const registerBulkNode = (request, response) => {
    const networkNodes = request.body.allNetworkNodes;
    networkNodes.forEach((node) => {
        const nodeNotPresent = PlatCoin.networkNodes.indexOf(node) == -1;
        const nodeNotCurrent = PlatCoin.currentNodeURL.indexOf(node) !== node;

        if(nodeNotPresent && nodeNotCurrent){
            PlatCoin.networkNodes.push(node);
        }
    });
    response.status(200).json({error: false, data: 'NODES REGISTERED SUCCESSFULLY'});
};
//RECEIVE NEW BLOCK
const receiveNewBlock = (request, response) => {
    const newBlock = request.body.newBlock;
    const lastBlock = PlatCoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 == newBlock['index'];

    if(correctHash && correctIndex){
        PlatCoin.chain.push(newBlock);
        PlatCoin.pendingTransactions = [];
        
        response.status(200).json({error: false, data: {message: 'NEW BLOCK RECEIVED AND ACCEPTED', block: newBlock}});
    } else {
        response.status(500).json({error: true, data: {message: 'NEW BLOCK REJECTED', block: newBlock}});
    }
};
//CONSENSUS
const consensus = (request, response) => {
    const requestPromises = [];

    PlatCoin.networkNodes.forEach((nodeURL) => {
        const options = {
            uri: nodeURL + 'check',
            method: 'GET',
            json: true,
        };
        requestPromises.push(request(options));
    });

    Promise.all(requestPromises)
    .then((platchains) => {
        const currentChainLength = PlatCoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;

        platchains.forEach((platchain) => {
            if (platchain.chain.length > maxChainLength){
                maxChainLength = platchain.chain.length;
                newLongestChain = platchain.chain;
                newPendingTransactions = platchain.pendingTransactions;
            }
        });

        if(!newLongestChain || (newLongestChain && !PlatCoin.chainIsValid(newLongestChain))){
            response.status(200).json({error: false, data: {
                message:'CURRENT CHAIN HAS NOT BEEN REPLACED', 
                chain: PlatCoin.chain
            }});
        } else if (newLongestChain && PlatCoin.chainIsValid(newLongestChain)){
            PlatCoin.chain = newLongestChain;
            PlatCoin.pendingTransactions = newPendingTransactions;
            response.status(200).json({error: false, data: {
                message: 'THIS CHAIN HAS BEEN REPLACED',
                chain: PlatCoin.chain
            }});
        }
    })
    .catch((error) => {
        response.status(500).json({error: true, message: error.message});
    });
};

//MODULE EXPORTING
module.exports = {
    check_chain,
    create_transaction,
    mine_block,
    registerBroadcastNode,
    registerNode,
    registerBulkNode,
    broadcast_transaction,
    receiveNewBlock,
    consensus
};