class Transaction {
    constructor(value, senderAddress, recipientAddress, idTransaction) {
        this.value = value;
        this.senderAddress = senderAddress;
        this.recipientAddress = recipientAddress;
        this.idTransaction = idTransaction;
    }
}

module.exports = Transaction;