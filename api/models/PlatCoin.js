//DEPENDENCIES
const PlatChain = require('./Platchain');
const PlatCoin = new PlatChain();
const uuid = require('uuid/v1'); 

//NODE ADDRESS
const NodeAddress = uuid().split('-').join('');

//MODULE EXPORTING
module.exports = {
    PlatCoin,
    NodeAddress
};