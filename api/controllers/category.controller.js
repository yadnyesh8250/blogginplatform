import Category from '../models/category.model.js';
import { errorHandler } from '../utils/error.js';

export const createCategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a category'));
  }
  const { name, description, parent } = req.body;
  if (!name) {
    return next(errorHandler(400, 'Name is required'));
  }
  const slug = name
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

  const newCategory = new Category({
    name,
    slug,
    description,
    parent,
  });
  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
