const BlockChain = require('../models/blockchain');
const axios = require('axios').default;

const {v1: uuid} = require('uuid');
const platCoin = new BlockChain();
const nodeAddress = uuid().split('-').join('');

const check = (request, response) => {
	response.status(200).json({error: false, data: platCoin});
};

const create_transaction = (request, response) => {
	const transaction = request.body;
	const idxBlock = platCoin.addToPendingTransactions(transaction);

	response.status(200).json({error: false, data: `Transaction will be added to block ${idxBlock}`});
};

const mine_block = async (request, response) => {
	try{
		const lastBlock = platCoin.getLastBlock();
		
		const currentBlockData = {
			transactions: platCoin.pendingTransactions,
			idx: lastBlock['idx'] + 1
		};

		const nonce = platCoin.proofOfWork(lastBlock['hash'], currentBlockData);
		const currentHash = platCoin.hashBlock(lastBlock['hash'], currentBlockData, nonce);

		const newBlock = platCoin.createNewBlock(nonce, currentHash, lastBlock['hash']);

		platCoin.networkNodes.forEach(async (nodeUrl) => {
			await axios.post(`${nodeUrl}/api/blockchain/block/receive`, newBlock);
		});

		await axios.post(`${platCoin.nodeAddress}/api/blockchain/transaction/create-broadcast`, { value: 12.5, senderAddress: "MININGBOT", recipientAddress: nodeAddress });

		response.status(200).json({error: false, data: newBlock});
	} catch(error) {
		response.status(500).json({error: true, data: error.message});
	}  
};

const register_broadcast = async (request, response) => {
	try {
		const newNodeUrl = request.body.newNodeUrl;
	
		if (platCoin.networkNodes.indexOf(newNodeUrl) == -1) {
			platCoin.networkNodes.push(newNodeUrl);
		}
		
		platCoin.networkNodes.forEach(async (nodeUrl) => {
			await axios.post(`${nodeUrl}/api/blockchain/node/register-one`, { newNodeUrl: newNodeUrl });
		});
	
		await axios.post(`${newNodeUrl}/api/blockchain/node/register-multiple`, { networkNodes: [...platCoin.networkNodes, platCoin.nodeAddress]});
		return response.status(200).json({ error: false, data: 'Node registered successfully on the network.' });
	} catch (error) {
		response.status(500).json({ error: true, data: error.message });
	}
};

const register_node = (request, response) => {
	const newNodeUrl = request.body.newNodeUrl;
	if (platCoin.networkNodes.indexOf(newNodeUrl) == -1 && platCoin.nodeAddress !== newNodeUrl) {
		platCoin.networkNodes.push(newNodeUrl);
	}
	response.status(200).json({error: false, data: 'Node registered successfully.'})
};

const register_multiple_nodes = (request, response) => {
	const networkNodes = request.body.networkNodes;
	networkNodes.forEach((nodeUrl) => {
		if(platCoin.networkNodes.indexOf(nodeUrl) == -1  && platCoin.nodeAddress !== nodeUrl) {
			platCoin.networkNodes.push(nodeUrl);
		}
	});

	response.status(200).json({error: false, data: "Multiple nodes registered successfully."});
};

const create_broadcast = async (request, response) => {
	try{
		const transactionInfo = request.body;
		const transaction = platCoin.createNewTransaction(transactionInfo.value, transactionInfo.senderAddress, transactionInfo.recipientAddress);
		platCoin.addToPendingTransactions(transaction);

		platCoin.networkNodes.forEach( async (nodeUrl) => {
			await axios.post(`${nodeUrl}/api/blockchain/transaction/create`, transaction);
		});
			response.status(200).json({error: false, data: 'Transaction is created and will be broadcasted through the network'});
	} catch(error) {
			response.status(500).json({error: true, data: error.message});
	}  
};

const receive_block = (request, response) => {
	const newBlock = request.body;
	const lastBlock = platCoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.hashPreviousBlock;
	const correctIdx = lastBlock['idx'] + 1 === newBlock['idx'];

	if(correctHash && correctIdx) {
		platCoin.blockchain.push(newBlock);
		platCoin.pendingTransactions = [];
		response.status(200).json({error: false, data: newBlock});
	} else {
		response.status(500).json({error: true, data: 'Block rejected'});
	}
};

const consensus = async (request, response) => {
	const blockchain = [];
	try {

		for(var idx = 0; idx < platCoin.networkNodes.length; idx++) {
			const response = await axios.get(`${platCoin.networkNodes[idx]}/api/blockchain/check`);
			blockchain.push(response.data.data);
		}

		const chainSize = platCoin.blockchain.length;
		let maxSize = chainSize;
		let newLongestChain;
		let newPendingTransactions;

		blockchain.forEach((blockchain) => {
			if(blockchain.blockchain.length > maxSize) {
				maxSize = blockchain.blockchain.length;
				newLongestChain = blockchain.blockchain;
				newPendingTransactions = blockchain.pendingTransactions;
			}
		});

		if (!newLongestChain || (newLongestChain && !platCoin.chainIsValid(newLongestChain))) {

			response.status(500).json({ error: true, message: 'Chain wasn\'t replaced.', data: platCoin.blockchain });
		} else {
			platCoin.blockchain = newLongestChain;
			platCoin.pendingTransactions = newPendingTransactions;
			response.status(200).json({ error: false, message: 'Chain was replaced.', data: platCoin.blockchain });
		}
	} catch (error) {
		response.status(500).json({ error: true, message: 'Chain wasn\'t replaced.', data: platCoin.blockchain });
	}
};

module.exports = {
	check,
	create_transaction,
	mine_block,
	register_broadcast,
	register_node,
	register_multiple_nodes,
	create_broadcast,
	receive_block,
	consensus,
	platCoin
};