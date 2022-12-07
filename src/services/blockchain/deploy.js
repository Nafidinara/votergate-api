const Web3 = require('web3');
const httpStatus = require('http-status');
const { ABI, BYTECODE } = require('../../utils/constants');
const { OFFICIAL_PK, OFFICIAL_ADDRESS, RPC_URL } = require('../../config/config');
const ApiError = require('../../utils/ApiError');

const init = async () => {
  // Connection Initialization
  try {
    const web3 = new Web3(RPC_URL);

    web3.eth.accounts.wallet.add(OFFICIAL_PK);
    return web3;
  } catch (e) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};

const deploy = async () => {
  const web3 = await init();
  let _transactionHash;
  // Contract object and account info
  const deployContract = new web3.eth.Contract(JSON.parse(JSON.stringify(ABI)), OFFICIAL_ADDRESS);

  // Function Parameter
  const payload = {
    data: BYTECODE,
    arguments: [OFFICIAL_ADDRESS],
  };

  const parameter = {
    from: OFFICIAL_ADDRESS,
    gas: web3.utils.toHex(1500000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
  };

  const txHash = await deployContract.deploy(payload).send(parameter, (err, transactionHash) => {
    _transactionHash = transactionHash;
  });

  return { address: txHash.options.address, transactionHash: _transactionHash };
  // Function Call
  // deployContract
  //   .deploy(payload)
  //   .send(parameter, (err, transactionHash) => {
  //     // eslint-disable-next-line no-console
  //     console.log('Transaction Hash :', transactionHash);
  //   })
  //   .on('confirmation', () => {})
  //   .then((newContractInstance) => {
  //     // eslint-disable-next-line no-console
  //     console.log('Deployed Contract Address : ', newContractInstance.options.address);
  //     return newContractInstance.options.address;
  //   });
};

module.exports = {
  deploy,
};
