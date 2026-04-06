import cloudinary from 'cloudinary';
import fs from 'fs';
import Media from '../models/media.model.js';

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // configure cloudinary from env
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'blogify',
    });

    // remove temp file
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      // ignore unlink errors
      console.warn('Failed to remove temp file', err.message);
    }

    const newMedia = new Media({
      url: result.secure_url,
      public_id: result.public_id,
      userId: req.user.id,
    });
    const savedMedia = await newMedia.save();

    return res.status(200).json({ url: savedMedia.url, public_id: savedMedia.public_id, _id: savedMedia._id });
  } catch (error) {
    next(error);
  }
};

const getMedia = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 20;

    const query = req.user.isAdmin ? {} : { userId: req.user.id };

    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json(media);
  } catch (error) {
    next(error);
  }
};

export default { uploadImage, getMedia };
