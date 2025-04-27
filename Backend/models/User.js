const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        sparse: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    profilePhoto: {
        type: String,
        default: '',
    },
    accounts: [{
        accountNumber: {
            type: String,
            required: true,
            unique: true, // Unique account number
        },
        pin: {
            type: String,
            required: true, // Pin required for account
        }
    }],
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    }],
    isVerified: {
        type: Boolean,
        default: false,
    },
    kycStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);