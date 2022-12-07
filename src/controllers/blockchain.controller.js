const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { BlockchainService, deployContractService } = require('../services');
const { LEDGER_URL } = require('../config/config');

const deploy = catchAsync(async (req, res) => {
  const contractAddress = await deployContractService.deploy();
  return res.status(httpStatus.OK).send({
    result: contractAddress,
  });
});

const addCandidate = catchAsync(async (req, res) => {
  try {
    const { contractAddress } = req.body;
    const blockchainService = new BlockchainService(contractAddress);
    const rest = await blockchainService.addCandidate(req.body.name, req.body.candidateId);
    return res.status(httpStatus.OK).send({
      status: 'OK',
      result: {
        transactionHash: rest.transactionHash,
        contractAddress: rest.to,
        proofUrl: `${LEDGER_URL}/tx/${rest.transactionHash}`,
      },
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      result: e.message,
    });
  }
});

const setQuota = catchAsync(async (req, res) => {
  try {
    const { contractAddress } = req.body;
    const blockchainService = new BlockchainService(contractAddress);
    const rest = await blockchainService.setQuota(req.body.size);
    return res.status(httpStatus.OK).send({
      status: 'OK',
      result: {
        transactionHash: rest.transactionHash,
        contractAddress: rest.to,
        proofUrl: `${LEDGER_URL}/tx/${rest.transactionHash}`,
      },
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      result: e.message,
    });
  }
});

const vote = catchAsync(async (req, res) => {
  try {
    const { contractAddress } = req.body;
    const blockchainService = new BlockchainService(contractAddress);
    const rest = await blockchainService.vote(req.body.candidateId, req.body.voterId);
    return res.status(httpStatus.OK).send({
      status: 'OK',
      result: {
        transactionHash: rest.transactionHash,
        contractAddress: rest.to,
        proofUrl: `${LEDGER_URL}/tx/${rest.transactionHash}`,
      },
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      result: e.message,
    });
  }
});

const getCandidates = catchAsync(async (req, res) => {
  try {
    const { contractAddress } = req.body;
    const blockchainService = new BlockchainService(contractAddress);
    const rest = await blockchainService.getCandidates();
    return res.status(httpStatus.OK).send({
      status: 'OK',
      result: rest,
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      result: e.message,
    });
  }
});

module.exports = {
  deploy,
  addCandidate,
  setQuota,
  vote,
  getCandidates,
};
