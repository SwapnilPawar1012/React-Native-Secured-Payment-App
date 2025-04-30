const express = require('express');
const multer = require('multer');
const { uploadImages, deleteAllImages, advanceBiometric } = require('../controllers/apBiometricController');

const apRouter = express.Router();

// SETUP MULTER
// Store files in memory (or use diskStorage if needed)
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// POST /api/auth/upload-images
apRouter.post('/upload-images', upload.array('photos', 20), uploadImages);

// DELETE /api/auth/delete-biometric
apRouter.delete('/delete-images/:userId', deleteAllImages);

// POST /api/auth/advance-biometric
apRouter.post('/advance-biometric', upload.array('currentPhotos', 4), advanceBiometric)
// apRouter.post('/advance-biometric', upload.array('currentPhotos'), advanceBiometric) // API with no limits

module.exports = apRouter;