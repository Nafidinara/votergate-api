const httpStatus = require('http-status');
const path = require('path');
const { unlink } = require('fs');
const { Candidate } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a room
 * @param {Object} roomBody
 * @returns {Promise<Candidate>}
 */
const createCandidate = async (roomBody) => {
  const roomModel = await Candidate.create(roomBody);
  return Candidate.findOne({ _id: roomModel._id }).populate(['room']);
};

/**
 * Query for candidates
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCandidates = async (filter, options) => {
  Object.assign(options, { populate: 'room' });
  return Candidate.paginate(filter, options);
};

/**
 * Query for candidates
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySearch = async (filter, options) => {
  return Candidate.find(filter, options).populate(['room']);
};

/**
 * Get room by id
 * @param {ObjectId} id
 * @returns {Promise<Candidate>}
 */
const getCandidateById = async (id) => {
  return Candidate.findById(id).populate(['room']);
};

/**
 * Update room by id
 * @param {ObjectId} roomId
 * @param {Object} updateBody
 * @returns {Promise<Candidate>}
 */
const updateCandidateById = async (roomId, updateBody) => {
  const roomModel = await Candidate.findOne({ _id: roomId });
  if (!roomModel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate not found');
  }
  Object.assign(roomModel, updateBody);
  await roomModel.save();
  return roomModel.populate(['room']);
};

/**
 * Delete room by id
 * @param {ObjectId} roomId
 * @returns {Promise<Candidate>}
 */
const deleteCandidateById = async (roomId) => {
  const roomModel = await getCandidateById(roomId);
  if (!roomModel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Candidate not found');
  }
  await roomModel.remove();
  return roomModel;
};

module.exports = {
  createCandidate,
  queryCandidates,
  getCandidateById,
  updateCandidateById,
  deleteCandidateById,
  querySearch,
};
