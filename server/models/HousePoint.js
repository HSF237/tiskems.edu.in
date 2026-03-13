import mongoose from 'mongoose';

const HouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: '#3b82f6' },
  points: { type: Number, default: 0 }
});

const HousePointSchema = new mongoose.Schema({
  houses: [HouseSchema],
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
