const Block = require('./block');
const Transaction = require('./transaction');
const sha256 = require('sha256');
const nodeAddress = process.argv[3];
const {v1: uuid} = require('uuid');

class Blockchain {
    constructor() {
        this.blockchain = [];
        this.pendingTransactions = [];
        this.nodeAddress = nodeAddress;
        this.networkNodes = [];
        
        this.createNewBlock(1234, 'GENESIS', 'BLOCK')
    }

    createNewBlock(nonce, hash, hashPreviousBlock) {
        const newBlock = new Block(
          this.blockchain.length + 1,
          this.pendingTransactions,
          nonce,
          hash,
          hashPreviousBlock
        );

        this.pendingTransactions = [];
        this.blockchain.push(newBlock);

        return newBlock;
    }

    getLastBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    createNewTransaction(value, senderAddress, recipientAddress) {
        const newTransaction = new Transaction(
          value,
          senderAddress,
          recipientAddress,
          uuid().split('-').join('')
        );

        return newTransaction;
    }

    addToPendingTransactions(transaction) {
        this.pendingTransactions.push(transaction);
        return this.getLastBlock()['idx'] + 1
    }

    hashBlock(hashPreviousBlock, currentBlockData, nonce) {
        const dataString = hashPreviousBlock + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataString);

        return hash;
    }

    proofOfWork(hashPreviousBlock, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(hashPreviousBlock, currentBlockData, nonce);

        while(hash.substring(0, 4) !== '0000')
        {
            nonce++;
            hash = this.hashBlock(hashPreviousBlock, currentBlockData, nonce);
        }

        return nonce;
    }

    chainIsValid(blockchain) {
        let chainIsValid = true;

        for (var idx = 1; idx < blockchain.length; idx++) {
            const currentBlock = blockchain[idx];
            const previousBlock = blockchain[idx - 1];
            const blockHash = this.hashBlock(previousBlock['hash'], { transactions: currentBlock.transactions, idx: currentBlock.idx }, currentBlock['nonce']);

            if (currentBlock['hashPreviousBlock'] !== previousBlock['hash'] || blockHash.substring(0, 4) !== '0000') {
                chainIsValid = false;
            }
        }

        const genesisBlock = blockchain[0];

        if(
            genesisBlock.nonce !== 1234 
            || genesisBlock.hash !== 'GENESIS' 
            || genesisBlock.hashPreviousBlock !== 'BLOCK' 
            || genesisBlock.transactions.length !== 0
          ) {
            chainIsValid = false;
        }
        
        return chainIsValid;
    }

    getBlock(blockHash){
        let correctBlock = null;
        this.blockchain.forEach((block) => {
            block.hash === blockHash ? correctBlock = block: null; 
        });
        return correctBlock;
    }

    getTransaction(idTransaction){
        let correctTransaction = null;
        let correctBlock = null;
        this.blockchain.forEach((block) => {
            block.transactions.forEach((transaction) => {
                if(transaction.idTransaction === idTransaction){
                    correctTransaction = transaction;
                    correctBlock = block;
                }
            });
        });
        return {
            transaction: correctTransaction,
            block: correctBlock
        };
    }

    getAddressData(address){
        const addressTransactions = [];
        this.blockchain.forEach((block) => {
            block.transactions.forEach((transaction) => {
                if (transaction.senderAddress === address || transaction.recipientAddress === address){
                    addressTransactions.push(transaction);
                }
            });
        });

        let balance = 0;

        addressTransactions.forEach((transaction) => {
            if(transaction.recipientAddress === address){
                balance += transaction.value;
            } else {
                balance -= transaction.value;
            }
        });

        return {
            addressTransactions,
            balance
        };

    }

}

module.exports = Blockchain;