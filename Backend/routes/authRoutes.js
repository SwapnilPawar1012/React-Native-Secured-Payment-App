const express = require('express');
const authRouter = express.Router();
const { registerUser, updateUserDetails } = require('../controllers/authController');

// POST /api/auth/register-phone
authRouter.post('/register-user', registerUser);

// PATCH /api/auth/update-user/:id
authRouter.patch('/update-user/:id', updateUserDetails);

module.exports = authRouter;