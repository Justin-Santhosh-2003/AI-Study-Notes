const Subject = require('../models/Subject');

// @desc    Get all subjects
// @route   GET /api/v1/subjects
// @access  Protected
const getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: subjects.length,
      subjects,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new subject
// @route   POST /api/v1/subjects
// @access  Protected + Teacher/Admin
const createSubject = async (req, res, next) => {
  try {
    const { name, code, description, color } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        status: 'fail',
        message: 'Subject name and code are required.',
      });
    }

    const subject = await Subject.create({
      name,
      code,
      description,
      color,
      createdBy: req.user._id,
    });

    await subject.populate('createdBy', 'name email role');

    res.status(201).json({
      status: 'success',
      message: 'Subject created successfully.',
      subject,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a subject
// @route   PUT /api/v1/subjects/:id
// @access  Protected + Teacher/Admin
const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ status: 'fail', message: 'Subject not found.' });
    }

    const { name, code, description, color } = req.body;

    subject.name = name || subject.name;
    subject.code = code || subject.code;
    subject.description = description !== undefined ? description : subject.description;
    subject.color = color || subject.color;

    await subject.save();

    res.status(200).json({
      status: 'success',
      message: 'Subject updated successfully.',
      subject,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a subject
// @route   DELETE /api/v1/subjects/:id
// @access  Protected + Teacher/Admin
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ status: 'fail', message: 'Subject not found.' });
    }

    await subject.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Subject deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllSubjects, createSubject, updateSubject, deleteSubject };
