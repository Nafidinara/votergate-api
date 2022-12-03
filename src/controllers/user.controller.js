const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status','role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getSearchUser = catchAsync(async (req, res) => {
  const query = req.body;
  const result = await userService.querySearch(query, {});
  res.send(result);
});

const getImageUser = catchAsync(async (req, res) => {
  const result = await userService.getImageUser(req.params.userId);
  res.sendFile(result);
});

const getTotalUser = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status','role']);
  const result = await userService.queryUsers(filter,{});
  res.send({
    'total' : result.totalResults
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  if (req.file){
    req.body.image = req.file;
  }
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).send({
    result : "Success delete"
  });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getTotalUser,
  getSearchUser,
  getImageUser
};
