const axios = require('axios');
const flatted = require('flatted');
const ApBiometric = require('../models/ApBiometric');

const uploadImages = async (req, res) => {
  console.log('Uploading images, Files received:', req.files);
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required, Please try again!' })
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Convert uploaded files into images array
    const images = req.files.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    }));

    // Find if user already exists
    let user = await ApBiometric.findOne({ userId });

    if (user) {
      // If user exists, push new images
      user.images.push(...images);
      await user.save();
    } else {
      // If not, create a new user document
      user = new ApBiometric({
        userId,
        images
      });
      await user.save();
    }

    res.status(200).json({ message: 'Images uploaded successfully', data: user });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

const deleteAllImages = async (req, res) => {
  const { userId } = req.params;
  console.log('Deleting all images for userId:', userId);

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required for deletion' });
  }

  try {
    const result = await ApBiometric.deleteMany({ userId }); // delete everything

    res.status(200).json({
      message: 'All images deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all images:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
};

const advanceBiometric = async (req, res) => {
  console.log('FILES RECEIVED:', req.files);
  console.log('BODY RECEIVED:', req.body);

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Backend: userId is required' });
    }

    // Get the paths of uploaded current photos
    const currentPhotos = req.files.map(file => file.buffer.toString('base64')); // Convert buffer to base64 string

    if (currentPhotos.length !== 4) {
      return res.status(400).json({ error: 'Backend: Exactly 4 current photos required.' });
    }

    // Fetch 8 stored images from MongoDB
    const user = await ApBiometric.findOne({ userId });

    if (!user || user.images.length < 20) {
      return res.status(404).json({ error: 'Backend: At least 20 stored images required' });
    }

    const storedImages = user.images.slice(0, 20);

    // Convert stored images from MongoDB to base64
    const storedImagesBase64 = storedImages.map(imgDoc => imgDoc.data.toString('base64'));

    // Prepare the data to send to Python API
    const requestData = {
      images: [...storedImagesBase64, ...currentPhotos], // Combine stored and current images
    };

    // Call the Python API
    const pythonApiUrl = 'http://192.168.154.241:5001/detect-faces'; // Python API URL
    const response = await axios.post(pythonApiUrl, requestData, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept all 2xx–4xx responses (exclude 5xx)
      }
    });

    const data = response.data;
    console.log('Python API response data: ', response.data)
    if (response.status === 400 || data.error) {
      return res.status(400).json({
        message: data.message || 'Face detection failed.',
      });
    }

    // Extract results from Python response
    const results = data.results;

    // Check if any current photo matched
    const anyMatchFound = results.some(result => result.match_found_with_stored === true);

    if (anyMatchFound) {
      return res.json({ success: true, message: 'Backend: Face matched successfully.' });
    } else {
      return res.json({ success: false, message: 'Backend: Face did not match.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Backend: Internal Server Error' });
  }
};

module.exports = { uploadImages, deleteAllImages, advanceBiometric };



/**
 * const deleteLast8Images = async (req, res) => {
  console.log('Deleting last 8 uploaded images');
  try {
    // Find the last 8 images based on creation time (_id has a timestamp inside)
    const images = await ApBiometric.find().sort({ _id: -1 }).limit(8);

    if (images.length === 0) {
      return res.status(404).json({ message: 'No images found to delete' });
    }

    const imageIds = images.map(img => img._id);

    // Delete the 8 images
    const result = await ApBiometric.deleteMany({ _id: { $in: imageIds } });

    res.status(200).json({ 
      message: 'Last 8 images deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting last 8 images:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
};

 */