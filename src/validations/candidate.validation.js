const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCandidate = {
  body: Joi.object().keys({
    room: Joi.custom(objectId).required(),
    image: Joi.string(),
    names: Joi.any().required(),
    profile: Joi.string().required(),
    visi: Joi.string(),
    misi: Joi.string(),
  }),
};

const getCandidates = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSearchCandidate = {
  body: Joi.object().keys({
    _id: Joi.alternatives().try(Joi.string(), Joi.array()),
  }),
};

const getCandidate = {
  params: Joi.object().keys({
    candidateId: Joi.string().custom(objectId),
  }),
};

const getImageCandidate = {
  params: Joi.object().keys({
    candidateId: Joi.string().custom(objectId),
  }),
};

const updateCandidate = {
  params: Joi.object().keys({
    candidateId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      room: Joi.custom(objectId),
      image: Joi.string(),
      names: Joi.any(),
      profile: Joi.string(),
      visi: Joi.string(),
      misi: Joi.string(),
    })
    .min(1),
};

const deleteCandidate = {
  params: Joi.object().keys({
    candidateId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCandidate,
  getCandidates,
  getCandidate,
  updateCandidate,
  deleteCandidate,
  getSearchCandidate,
  getImageCandidate,
};
