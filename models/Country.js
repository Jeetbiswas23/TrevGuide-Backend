const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  attractions: [{
    name: String,
    description: String,
    location: String
  }],
  tips: [String],
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Country', countrySchema);