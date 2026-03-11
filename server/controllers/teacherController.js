import User from '../models/User.js';
import { saveFile } from '../utils/upload.js';

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Public
export const getTeachers = async (req, res) => {
  try {
    const { subject, department } = req.query;
    let query = { role: 'teacher', isActive: true };

    if (subject) {
      query.subject = new RegExp(subject, 'i');
    }

    const teachers = await User.find(query)
      .select('-password')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Public
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' })
      .select('-password');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create teacher
// @route   POST /api/teachers
// @access  Private/Admin
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, phone, subject, qualification, experience } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email already exists'
      });
    }

    const teacherData = {
      name,
      email,
      password: password || 'Teacher@123', // Default password
      role: 'teacher',
      phone,
      subject,
      qualification,
      experience: parseInt(experience) || 0
    };

    if (req.file) {
      teacherData.profileImage = await saveFile(req.file.buffer, req.file.mimetype, req.file.fieldname, {
        transformation: [
          { width: 500, height: 500, crop: 'fill', gravity: 'face' }
        ]
      });
    }

    const teacher = await User.create(teacherData);

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private/Admin
export const updateTeacher = async (req, res) => {
  try {
    const { name, phone, subject, qualification, experience } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (subject) updateData.subject = subject;
    if (qualification) updateData.qualification = qualification;
    if (experience) updateData.experience = parseInt(experience);

    if (req.file) {
      updateData.profileImage = await saveFile(req.file.buffer, req.file.mimetype, req.file.fieldname, {
        transformation: [
          { width: 500, height: 500, crop: 'fill', gravity: 'face' }
        ]
      });
    }

    const teacher = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Soft delete
    teacher.isActive = false;
    await teacher.save();

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

