//DEPENDENCIES
const express = require('express');
const router = express.Router();

//CONTROLLER IMPORTING
const chain_ctrl = require('../controllers/chain_controller');

//ROUTES DECLARATION

//CHECKS THE ENTIRE BLOCKCHAIN
router.route('/check').get(chain_ctrl.check_chain);
//CREATE A NEW TRANSACTION
router.route('/create/transaction').post(chain_ctrl.create_transaction);
//MINE A NEW BLOCK
router.route('/mine').get(chain_ctrl.mine_block);

//MODULE EXPORTING
module.exports = router;    