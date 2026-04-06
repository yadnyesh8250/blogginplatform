import Tag from '../models/tag.model.js';
import { errorHandler } from '../utils/error.js';

export const createTag = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a tag'));
  }
  const { name, description } = req.body;
  if (!name) {
    return next(errorHandler(400, 'Name is required'));
  }
  const slug = name
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

  const newTag = new Tag({
    name,
    slug,
    description,
  });
  try {
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    next(error);
  }
};

export const getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};
