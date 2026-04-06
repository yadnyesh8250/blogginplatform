import Settings from '../models/settings.model.js';
import { errorHandler } from '../utils/error.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings();
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to update site settings'));
  }
  try {
    const settings = await Settings.findOne();
    if (!settings) {
        const newSettings = new Settings(req.body);
        const savedSettings = await newSettings.save();
        return res.status(200).json(savedSettings);
    }
    
    const updatedSettings = await Settings.findByIdAndUpdate(
      settings._id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedSettings);
  } catch (error) {
    next(error);
  }
};
