const express = require('express');
const router = express.Router();

const chain_ctrl = require('../controllers/chain_controller');

router.route('/check').get(chain_ctrl.check);
router.route('/transaction/create').post(chain_ctrl.create_transaction);
router.route('/transaction/create-broadcast').post(chain_ctrl.create_broadcast);
router.route('/block/mine').get(chain_ctrl.mine_block);
router.route('/node/register-broadcast').post(chain_ctrl.register_broadcast);
router.route('/node/register-one').post(chain_ctrl.register_node);
router.route('/node/register-multiple').post(chain_ctrl.register_multiple_nodes);
router.route('/block/receive').post(chain_ctrl.receive_block);
router.route('/consensus').get(chain_ctrl.consensus);

module.exports = router;    