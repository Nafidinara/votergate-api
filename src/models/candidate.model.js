/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const candidateSchema = mongoose.Schema(
  {
    room: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Room',
      trim: true,
      required: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    names: [{
      type: String,
      trim: true,
      required: true,
    }],
    profile: {
      type: String,
      required: true,
      trim: true,
    },
    visi: {
      type: String,
      required: false,
      trim: true,
    },
    misi: {
      type: String,
      required: false,
      trim: true,
    },
    startDatetime: {
      type: Date,
      required: false,
      trim: true,
    },
    endDatetime: {
      type: Date,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
candidateSchema.plugin(toJSON);
candidateSchema.plugin(paginate);

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
