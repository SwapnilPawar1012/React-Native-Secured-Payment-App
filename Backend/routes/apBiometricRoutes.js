const express = require('express');
const multer = require('multer');
const { uploadImages, deleteAllImages, advanceBiometric } = require('../controllers/apBiometricController');

const apRouter = express.Router();

// Setup multer
const storage = multer.memoryStorage(); // Store files in memory (or use diskStorage if you want)
const upload = multer({ storage });

// POST /api/auth/upload-images
apRouter.post('/upload-images', upload.array('photos', 8), uploadImages);

// DELETE /api/auth/delete-biometric
apRouter.delete('/delete-images/:userId', deleteAllImages);

// POST /api/auth/advance-biometric
apRouter.post('/advance-biometric', upload.array('currentPhotos', 2), advanceBiometric)

module.exports = apRouter;