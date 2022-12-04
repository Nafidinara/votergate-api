const httpStatus = require('http-status');
const path = require('path');
const { unlink } = require('fs');
const { Room } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a room
 * @param {Object} roomBody
 * @returns {Promise<Room>}
 */
const createRoom = async (roomBody) => {
  const roomModel = await Room.create(roomBody);
  return Room.findOne({ _id: roomModel._id }).populate(['user']);
};

/**
 * Query for rooms
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRooms = async (filter, options) => {
  Object.assign(options, { populate: 'user' });
  return Room.paginate(filter, options);
};

/**
 * Query for rooms
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySearch = async (filter, options) => {
  return Room.find(filter, options).populate(['user']);
};

/**
 * Get room by id
 * @param {ObjectId} id
 * @returns {Promise<Room>}
 */
const getRoomById = async (id) => {
  return Room.findById(id).populate(['user']);
};

const getImageRoom = async (roomId) => {
  const roomModel = await getRoomById(roomId);
  if (!roomModel || !roomModel.image) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room or image not found');
  }

  const dirname = path.resolve();
  return path.join(dirname, roomModel.image);
};

/**
 * Update room by id
 * @param {ObjectId} roomId
 * @param {Object} updateBody
 * @returns {Promise<Room>}
 */
const updateRoomById = async (roomId, updateBody) => {
  const roomModel = await Room.findOne({ _id: roomId });
  if (!roomModel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  Object.assign(roomModel, updateBody);
  await roomModel.save();
  return roomModel.populate(['user']);
};

/**
 * Delete room by id
 * @param {ObjectId} roomId
 * @returns {Promise<Room>}
 */
const deleteRoomById = async (roomId) => {
  const roomModel = await getRoomById(roomId);
  if (!roomModel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  await roomModel.remove();
  return roomModel;
};

module.exports = {
  createRoom,
  queryRooms,
  getRoomById,
  updateRoomById,
  deleteRoomById,
  querySearch,
  getImageRoom,
};
