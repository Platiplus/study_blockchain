const express = require('express');
const router = express.Router();

const explorer_ctrl = require('../controllers/explorer_controller');

router.route('/').get(explorer_ctrl.frontend);
router.route('/block/:blockHash').get(explorer_ctrl.block_hash);
router.route('/transaction/:idTransaction').get(explorer_ctrl.transaction_id);
router.route('/address/:address').get(explorer_ctrl.address);

module.exports = router;