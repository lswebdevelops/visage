import express from 'express';
import asyncHandler from 'express-async-handler';
import AboutUs from '../models/aboutUsModel.js';

const router = express.Router();

// @desc    Get about_us
// @route   GET /api/about_us
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const about_us = await AboutUs.find({});
    res.json(about_us);
  })
);

export default router;
