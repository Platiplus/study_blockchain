//DEPENDENCIES
const express = require('express');
const router = express.Router();

//CONTROLLER IMPORTING
const chain_ctrl = require('../controllers/chain_controller');

//ROUTES DECLARATION

//CHECKS THE ENTIRE BLOCKCHAIN
router.route('/check').get(chain_ctrl.check_chain);
//CREATE A NEW TRANSACTION
router.route('/transaction/create').post(chain_ctrl.create_transaction);
//BROADCAST TRANSACTION
router.route('/transaction/broadcast').post(chain_ctrl.broadcast_transaction);
//MINE A NEW BLOCK
router.route('/mine').get(chain_ctrl.mine_block);
//REGISTER AND BROADCAST NODE
router.route('/node/register-broadcast').post(chain_ctrl.registerBroadcastNode);
//REGISTER NODE
router.route('/node/register').post(chain_ctrl.registerNode);
//REGISTER NODES BULK
router.route('/node/register-bulk').post(chain_ctrl.registerBulkNode);
//RECEIVE NEW BLOCK
router.route('/node/receive').post(chain_ctrl.receiveNewBlock);

//MODULE EXPORTING
module.exports = router;    