//DEPENDENCIES
const PlatChain = require('../models/Platchain');  
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
        
        const blockIndex = PlatCoin.createNewTransaction(transaction.amount, transaction.sender, transaction.recipient);
        response.status(200).json({error: false, data: `Transaction will be added on block ${blockIndex}.`});

    } catch(error) {
        
        response.status(500).json({error: true, data: error.message});

    }    
};
//MINE A NEW BLOCK
const mine_block = (request, response) => {
    try {
        const lastBlock = PlatCoin.getLastBlock();

        const previousBlockHash = lastBlock['hash'];
        
        const currentBlockData = {
            transactions: PlatCoin.pendingTransactions,
            index: lastBlock['index'] + 1
        };

        const nonce = PlatCoin.proofOfWork(previousBlockHash, currentBlockData);

        const blockHash = PlatCoin.hashBlock(previousBlockHash, currentBlockData, nonce); 

        PlatCoin.createNewTransaction(12.5, '00', nodeAddress);
        
        const newBlock = PlatCoin.createNewBlock(nonce, previousBlockHash, blockHash);

        response.status(200).json({error: false, data: { message: "Block mined successfully!" , block: newBlock}});

    } catch(error) {
        
        response.status(500).json({error: true, data: error.message});

    }
};

//MODULE EXPORTING
module.exports = {
    check_chain,
    create_transaction,
    mine_block
};