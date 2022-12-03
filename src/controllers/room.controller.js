const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roomService } = require('../services');
const Ipfs = require('../services/ipfs.service');
const { IPFSProjectId, IPFSProjectSecret } = require('../config/config');

const ipfsService = new Ipfs({ IPFSProjectId, IPFSProjectSecret, host: 'ipfs.infura.io', protocol: 'https', port: 5001 });

const createRoom = catchAsync(async (req, res) => {
  if (req.files.thumbnail) {
    req.body.thumbnail = await ipfsService.addFile({ content: req.files.thumbnail.data, path: req.files.thumbnail.name });
  }
  const room = await roomService.createRoom(req.body);
  res.status(httpStatus.CREATED).send(room);
});

const getRooms = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await roomService.queryRooms(filter, options);
  res.send(result);
});

const getSearchRoom = catchAsync(async (req, res) => {
  const query = req.body;
  const result = await roomService.querySearch(query, {});
  res.send(result);
});

const getImageRoom = catchAsync(async (req, res) => {
  const result = await roomService.getImageRoom(req.params.roomId);
  res.sendFile(result);
});

const getRoom = catchAsync(async (req, res) => {
  const room = await roomService.getRoomById(req.params.roomId);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  res.send(room);
});

const updateRoom = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = req.file.path;
  }
  const room = await roomService.updateRoomById(req.params.roomId, req.body);
  res.send(room);
});

const deleteRoom = catchAsync(async (req, res) => {
  await roomService.deleteRoomById(req.params.roomId);
  res.status(httpStatus.OK).send({
    result: 'Success delete',
  });
});

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
  getSearchRoom,
  getImageRoom,
};
