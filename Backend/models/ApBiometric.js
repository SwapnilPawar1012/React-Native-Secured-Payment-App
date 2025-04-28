const mongoose = require('mongoose');

const ApBiometricSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String,
    createdAt: {
        type: Date,
        default: Date.now,
        // expires: 3600, // optional: delete automatically after 1 hour
    },
});

module.exports = mongoose.model('ApBiometric', ApBiometricSchema);