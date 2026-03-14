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
      data: points || { houses: [], isActive: false }
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
    const { houses, isActive, isEnded } = req.body;

    // We update the most recent record or create a new one
    let points = await HousePoint.findOne().sort({ createdAt: -1 });

    if (points) {
      points.houses = houses || [];
      points.isActive = (isActive === true || isActive === 'true');
      points.isEnded = (isEnded === true || isEnded === 'true');
      points.updatedBy = req.user.id;
      points.lastUpdated = Date.now();
      points.markModified('houses'); 
      await points.save();
    } else {
      points = await HousePoint.create({
        houses: houses || [],
        isActive: (isActive === true || isActive === 'true'),
        isEnded: (isEnded === true || isEnded === 'true'),
        updatedBy: req.user.id
      });
    }

    res.json({
      success: true,
      message: 'House Championship updated successfully',
      data: points
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
