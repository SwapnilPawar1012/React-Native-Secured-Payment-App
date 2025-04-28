const ApBiometric = require('../models/ApBiometric'); // Import model

const uploadImages = async (req, res) => {
  console.log('Uploading images, Files received:', req.files); // Log the received files
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const savedImages = await Promise.all(
      req.files.map(file => {
        const newImage = new ApBiometric({
          data: file.buffer,
          contentType: file.mimetype,
        });
        return newImage.save();
      })
    );

    res.status(200).json({ message: 'Images uploaded successfully', files: savedImages });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

const deleteAllImages = async (req, res) => {
  console.log('Deleting all images');
  try {
    const result = await ApBiometric.deleteMany({}); // delete everything

    res.status(200).json({
      message: 'All images deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all images:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
};

module.exports = { uploadImages, deleteAllImages };



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