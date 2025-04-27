const User = require('../models/User')

const registerUser = async (req, res) => {
    const { phone } = req.body;

    try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        const user = new User({
            phone,
            isVerified: false,
        });

        await user.save();

        res.status(201).json({
            _id: user._id,
            phone: user.phone,
            isVerified: user.isVerified,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserDetails = async (req, res) => {
    const userId = req.params.id;
    const updates = req.body; // { fullName: "Swapnil", email: "swapnil@example.com" }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true } // Return the updated user
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            phone: user.phone,
            fullName: user.fullName,
            email: user.email,
            profilePhoto: user.profilePhoto,
            walletBalance: user.walletBalance,
            isVerified: user.isVerified,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, updateUserDetails };