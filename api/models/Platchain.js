//DEPENDECIES
const sha256 = require('sha256');
const uuid = require('uuid/v1'); 

//PLATCHAIN CLASS
class PlatChain {
    constructor(){
        this.chain = [];
        this.pendingTransactions = [];
        this.currentNodeURL = `http://localhost:${process.env.PORT}`;
        this.networkNodes = [];
        //CREATION OF GENESIS BLOCK
        this.createNewBlock(100, 'PLATIPLUS', 'GENESIS');
    }
    //CREATE A NEW BLOCK METHOD
    createNewBlock(nonce, previousBlockHash, hash){
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce,
            hash,
            previousBlockHash
        };
        
        this.pendingTransactions = [];
        this.chain.push(newBlock);
        
        return newBlock;
    };
    //GET LAST BLOCK METHOD
    getLastBlock(){
        return this.chain[this.chain.length - 1];
    };
    //CREATE NEW TRANSATION METHOD
    createNewTransaction(amount, sender, recipient){
        const new_transaction = {
            amount,
            sender,
            recipient,
            transactionID: uuid().split('-').join('')
        };

        return new_transaction;
    };
    //ADD TRANSACTION TO PENDING TRANSACTIONS
    addTransactionToPending(transaction){
        this.pendingTransactions.push(transaction);
        return this.getLastBlock()['index'] +1;
    };
    //HASH BLOCK METHOD
    hashBlock(previousBlockHash, currentBlockData, nonce){
        const dataString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataString);
        return hash;
    };
    //PROOF OF WORK METHOD
    proofOfWork(previousBlockHash, currentBlockData){
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

        while(hash.substring(0, 4) !== '0000'){
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        }

        return nonce;
    };
    //CHAIN IS VALID
    chainIsValid(platchain){
        let validChain = true;

        for(let i = 1; i < platchain.length; i++){
            const currentBlock = platchain[i];
            const previousBlock = platchain[i-1];
            const blockHash = this.hashBlock(previousBlock['hash'], {transactions: currentBlock['transactions'], index: currentBlock['index']}, currentBlock['nonce']);

            blockHash.substring(0, 4) !== '0000' ? validChain = false : validChain = true;
            currentBlock['previousBlockHash'] != previousBlock['hash'] ? validChain = false : validChain = true;

        }

        const genesisBlock = platchain[0];

        const correctNonce = genesisBlock['nonce'] === 100;
        const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
        const correctHash = genesisBlock['hash'] === '0';
        const correctTransactions = genesisBlock['transactions'].length === 0;

        if(!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions){
            validChain = false;
        }

        return validChain;
    }
}

module.exports = PlatChain;