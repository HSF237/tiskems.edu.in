import Gallery from '../models/Gallery.js';

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
export const getGalleryItems = async (req, res) => {
  try {
    const { type, category } = req.query;
    let query = {};

    if (type) query.type = type;
    if (category) query.category = category;

    const items = await Gallery.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
export const getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create gallery item
// @route   POST /api/gallery
// @access  Private/Admin
export const createGalleryItem = async (req, res) => {
  try {
    const { title, description, type, category, filePath } = req.body;

    if (!req.file && !filePath) {
      return res.status(400).json({
        success: false,
        message: 'Image/video file OR a link is required'
      });
    }

    const finalPath = req.file ? `uploads/${req.file.path.split(/uploads[\\/]/).pop().replace(/\\/g, '/')}` : filePath;

    const galleryItem = await Gallery.create({
      title,
      description,
      type: type || 'image',
      category: category || 'general',
      filePath: finalPath,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: galleryItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
export const updateGalleryItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (req.file) item.filePath = req.file.path;

    await item.save();

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

