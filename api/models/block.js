class Block {
    constructor(idx, pendingTransactions, nonce, hash, hashPreviousBlock){
        this.idx = idx,
        this.timestamp = Date.now();
        this.transactions = pendingTransactions;
        this.nonce = nonce;
        this.hash = hash;
        this.hashPreviousBlock = hashPreviousBlock;
    }
}

module.exports = Block;