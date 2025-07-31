import express from 'express';
import asyncHandler from 'express-async-handler';
import Biography from '../models/biographyModel.js';

const router = express.Router();

// @desc    Get biography
// @route   GET /api/biography
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const biography = await Biography.find({});
    res.json(biography);
  })
);

export default router;
