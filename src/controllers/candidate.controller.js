const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { candidateService, IpfsService, BlockchainService, roomService} = require('../services');
const { IPFSProjectId, IPFSProjectSecret } = require('../config/config');

const ipfsService = new IpfsService({
  IPFSProjectId,
  IPFSProjectSecret,
  host: 'ipfs.infura.io',
  protocol: 'https',
  port: 5001,
});

const createCandidate = catchAsync(async (req, res) => {
  if (req.files.image) {
    req.body.image = await ipfsService.addFile({ content: req.files.image.data, path: req.files.image.name });
  }
  const candidate = await candidateService.createCandidate(req.body);
  const room = await roomService.getRoomById(req.body.room);
  const blockchainService = new BlockchainService(room.contract);
  const name = JSON.parse(req.body.names).join(', ');
  await blockchainService.addCandidate(name, candidate.id);
  res.status(httpStatus.CREATED).send({
    status: 'CREATED',
    candidate,
  });
});

const getCandidates = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await candidateService.queryCandidates(filter, options);
  res.send(result);
});

const getSearchCandidate = catchAsync(async (req, res) => {
  const query = req.body;
  const result = await candidateService.querySearch(query, {});
  res.send(result);
});

const getImageCandidate = catchAsync(async (req, res) => {
  const result = await candidateService.getImageCandidate(req.params.candidateId);
  res.sendFile(result);
});

const getCandidate = catchAsync(async (req, res) => {
  const candidate = await candidateService.getCandidateById(req.params.candidateId);
  if (!candidate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate not found');
  }
  res.send(candidate);
});

const updateCandidate = catchAsync(async (req, res) => {
  if (req.files.image) {
    req.body.image = await ipfsService.addFile({ content: req.files.image.data, path: req.files.image.name });
  }
  const candidate = await candidateService.updateCandidateById(req.params.candidateId, req.body);
  res.send(candidate);
});

const deleteCandidate = catchAsync(async (req, res) => {
  await candidateService.deleteCandidateById(req.params.candidateId);
  res.status(httpStatus.OK).send({
    result: 'Success delete',
  });
});

module.exports = {
  createCandidate,
  getCandidates,
  getCandidate,
  updateCandidate,
  deleteCandidate,
  getSearchCandidate,
  getImageCandidate,
};
