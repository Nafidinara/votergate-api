const Joi = require('joi');

const addCandidate = {
  body: Joi.object().keys({
    contractAddress: Joi.string().required(),
    name: Joi.string().required(),
    candidateId: Joi.string().required(),
  }),
};

const setQuota = {
  body: Joi.object().keys({
    contractAddress: Joi.string().required(),
    size: Joi.number().required(),
  }),
};

const vote = {
  body: Joi.object().keys({
    contractAddress: Joi.string().required(),
    candidateId: Joi.string().required(),
    voterId: Joi.string().required(),
  }),
};

module.exports = {
  addCandidate,
  setQuota,
  vote,
};
