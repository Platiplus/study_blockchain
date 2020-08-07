const PlatCoin = require('./chain_controller').platCoin;
const path = require('path');

const block_hash = (request, response) => {
    const blockHash = request.params.blockHash;
    const correctBlock = PlatCoin.getBlock(blockHash);
    response.status(200).json({error: false, data: correctBlock});
};

const transaction_id = (request, response) => {
    const idTransaction = request.params.idTransaction;
    const transactionData = PlatCoin.getTransaction(idTransaction);
    response.status(200).json({error: false, data: {transaction: transactionData.transaction, block: transactionData.block}});
};

const address = (request, response) => {
    const address = request.params.address;
    const addressData = PlatCoin.getAddressData(address);
    response.status(200).json({error: false, data: addressData});
};

const frontend = (request, response) => {
    response.status(200).sendFile(path.resolve('./front_end/index.html'));
};

module.exports = {
    block_hash,
    transaction_id,
    address,
    frontend
};