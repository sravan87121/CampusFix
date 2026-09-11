const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Category = require('../models/Category');

const listCategories = asyncHandler(async (req, res) => {
  const filter = req.user?.role === 'ADMIN' ? {} : { isActive: true };
  const categories = await Category.find(filter).sort({ name: 1 });
  res.status(200).json({ success: true, data: { categories } });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  if (!name) throw new ApiError(400, 'Category name is required');

  const existing = await Category.findOne({ name });
  if (existing) throw new ApiError(409, 'Category already exists');

  const category = await Category.create({ name, description, icon });
  res.status(201).json({ success: true, data: { category } });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  ['name', 'description', 'icon', 'isActive'].forEach((field) => {
    if (req.body[field] !== undefined) category[field] = req.body[field];
  });

  await category.save();
  res.status(200).json({ success: true, data: { category } });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  // Soft-delete: deactivate rather than hard-delete, since tickets reference it.
  category.isActive = false;
  await category.save();
  res.status(200).json({ success: true, data: { category } });
});

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
