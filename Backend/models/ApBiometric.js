const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const ApBiometricSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      unique: true // optional: one set of images per user
    },
    images: [imageSchema] // array of images
  });
  
  const ApBiometric = mongoose.model('ApBiometric', ApBiometricSchema);
  
  module.exports = ApBiometric;