import express from 'express';
import HousePoint from '../models/HousePoint.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get current house points
// @route   GET /api/house-points
// @access  Public
router.get('/', async (req, res) => {
  try {
    const points = await HousePoint.findOne().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: points || { emerald: 0, ruby: 0, sapphire: 0, topaz: 0, isActive: false }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update house points
// @route   POST /api/house-points
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { emerald, ruby, sapphire, topaz, isActive } = req.body;

    // We only keep one record for the leaderboard
    let points = await HousePoint.findOne();

    if (points) {
      points.emerald = emerald;
      points.ruby = ruby;
      points.sapphire = sapphire;
      points.topaz = topaz;
      points.isActive = isActive;
      points.updatedBy = req.user.id;
      points.lastUpdated = Date.now();
      await points.save();
    } else {
      points = await HousePoint.create({
        emerald,
        ruby,
        sapphire,
        topaz,
        isActive,
        updatedBy: req.user.id
      });
    }

    res.json({
      success: true,
      message: 'House points updated successfully',
      data: points
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
