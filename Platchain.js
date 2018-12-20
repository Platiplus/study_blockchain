const sha256 = require('sha256');

class PlatChain {
    constructor(){
        this.chain = [];
        this.pendingTransactions = [];
    }
    
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

    getLastBlock(){
        return this.chain[this.chain.length - 1];
    };

    createNewTransaction(amount, sender, recipient){
        const new_transaction = {
            amount,
            sender,
            recipient
        };
        
        this.pendingTransactions.push(new_transaction);
        
        return this.getLastBlock()['index'] + 1;
    };

    hashBlock(previousBlockHash, currentBlockData, nonce){
        const dataString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataString);
        return hash;
    };

    proofOfWork(previousBlockHash, currentBlockData){
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

        while(hash.substring(0, 4) !== '0000'){
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        }

        return nonce;
    }
}

module.exports = PlatChain;