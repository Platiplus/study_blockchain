//DEPENDENCIES
const PlatCoin = require('./chain_controller').PlatCoin;
const path = require('path');

//METHODS DECLARATION

//GET BLOCK BY BLOCK HASH
const block_hash = (request, response) => {
    const blockHash = request.params.blockHash;
    const correctBlock = PlatCoin.getBlock(blockHash);
    response.status(200).json({error: false, data: correctBlock});
};

//GET TRANSACTION BY ITS ID
const transaction_id = (request, response) => {
    const transactionID = request.params.transactionID;
    const transactionData = PlatCoin.getTransacion(transactionID);
    response.status(200).json({error: false, data: {transaction: transactionData.transaction, block: transactionData.block}});
};

//GET BY ITS ADDRESS
const address = (request, response) => {
    const address = request.params.address;
    const addressData = PlatCoin.getAddressData(address);
    response.status(200).json({error: false, data: addressData});
};

//GET FRONT-END
const frontend = (request, response) => {
    response.status(200).sendFile(path.resolve('./front_end/index.html'));
};

//MODULE EXPORTING
module.exports = {
    block_hash,
    transaction_id,
    address,
    frontend
};