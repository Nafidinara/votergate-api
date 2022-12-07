/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const roomSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      trim: true,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    quota: {
      type: Number,
      trim: true,
      required: true,
    },
    s_method: {
      type: String,
      trim: true,
      required: true,
    },
    isPublic: {
      type: Boolean,
      trim: true,
      required: true,
    },
    quickCount: {
      type: Boolean,
      trim: true,
      required: true,
    },
    contract: {
      type: String,
      trim: true,
      required: false,
    },
    room_key: {
      type: String,
      trim: true,
      required: false,
    },
    hashes: [{
      type: String,
      trim: true,
    }],
    participants : [{
      type: String,
      trim: true,
    }],
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
roomSchema.plugin(toJSON);
roomSchema.plugin(paginate);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
