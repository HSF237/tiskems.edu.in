import mongoose from 'mongoose';

const HousePointSchema = new mongoose.Schema({
  emerald: {
    type: Number,
    default: 0
  },
  ruby: {
    type: Number,
    default: 0
  },
  sapphire: {
    type: Number,
    default: 0
  },
  topaz: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('HousePoint', HousePointSchema);
