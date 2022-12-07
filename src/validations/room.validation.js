const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRoom = {
  body: Joi.object().keys({
    user: Joi.custom(objectId).required(),
    thumbnail: Joi.any(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    quota: Joi.number().required(),
    s_method: Joi.string().required(),
    isPublic: Joi.boolean().required(),
    quickCount: Joi.boolean().required(),
    contract: Joi.string(),
    room_key: Joi.string(),
    hashes: Joi.array(),
    participants: Joi.array(),
    startDatetime: Joi.date(),
    endDatetime: Joi.date(),
  }),
};

const getRooms = {
  query: Joi.object().keys({
    title: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSearchRoom = {
  body: Joi.object().keys({
    _id: Joi.alternatives().try(Joi.string(), Joi.array()),
    title: Joi.alternatives().try(Joi.string(), Joi.array()),
  }),
};

const getRoom = {
  params: Joi.object().keys({
    roomId: Joi.string().custom(objectId),
  }),
};

const getImageRoom = {
  params: Joi.object().keys({
    roomId: Joi.string().custom(objectId),
  }),
};

const updateRoom = {
  params: Joi.object().keys({
    roomId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      user: Joi.custom(objectId),
      thumbnail: Joi.string(),
      title: Joi.string(),
      description: Joi.string(),
      quota: Joi.number(),
      s_method: Joi.string(),
      isPublic: Joi.boolean(),
      quickCount: Joi.boolean(),
      contract: Joi.string(),
      room_key: Joi.string(),
      hashes: Joi.array(),
      participants: Joi.array(),
      startDatetime: Joi.date(),
      endDatetime: Joi.date(),
    })
    .min(1),
};

const deleteRoom = {
  params: Joi.object().keys({
    roomId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
  getSearchRoom,
  getImageRoom,
};
