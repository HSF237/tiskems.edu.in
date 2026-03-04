import mongoose from 'mongoose';

const tcSchema = new mongoose.Schema({
  tcNumber: {
    type: String,
    unique: true
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  admissionNumber: {
    type: String,
    required: [true, 'Admission number is required'],
    trim: true
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  parentName: {
    type: String,
    required: [true, 'Parent name is required'],
    trim: true
  },
  dateOfLeaving: {
    type: Date,
    required: [true, 'Date of leaving is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true
  },
  character: {
    type: String,
    enum: ['good', 'satisfactory', 'poor'],
    default: 'good'
  },
  conduct: {
    type: String,
    enum: ['good', 'satisfactory', 'poor'],
    default: 'good'
  },
  qrCode: {
    type: String, // Base64 QR code image
    default: ''
  },
  pdfPath: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate TC number before saving
tcSchema.pre('save', async function (next) {
  if (!this.tcNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('TC').countDocuments({
      createdAt: { $gte: new Date(year, 0, 1) }
    });
    this.tcNumber = `TC${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const TC = mongoose.model('TC', tcSchema);
export default TC;

