//DEPENDENCIES
const express = require('express');
const router = express.Router();

//CONTROLLER IMPORTING
const explorer_ctrl = require('../controllers/explorer_controller');

//ROUTES DECLARATION

//GET THE FRONT_END
router.route('/').get(explorer_ctrl.frontend);
//SEARCH BLOCK BY BLOCKHASH
router.route('/block/:blockHash').get(explorer_ctrl.block_hash);
//SEARCH TRANSACTION BY TRANSACTION ID
router.route('/transaction/:transactionID').get(explorer_ctrl.transaction_id);
//SEARCH TRANSACTIONS BY ADDRESS
router.route('/address/:address').get(explorer_ctrl.address);

//MODULE EXPORTING
module.exports = router;