const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: Number, required: true, min: 0 }, // Added min validation for experience
  gender: { type: String, enum: ['male', 'female'], required: true },
  consultation_fee: { type: Number, required: true, min: 0 }, // Ensured fee is non-negative
  availability: { type: String, enum: ['online', 'offline', 'both'], required: true },
  ratings: { type: Number, default: 0, min: 0, max: 5 }, // Added validation for ratings (between 0 and 5)
  language: { type: [String], required: true }, // Array of languages, cannot be empty
  mode_of_consult: { type: String, enum: ['Video', 'In-Person', 'Both'], required: true }, // Added validation for consult modes
  hospital: { type: String, required: true }, // Ensured hospital field is required
  qualification: { type: String },
  description: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
