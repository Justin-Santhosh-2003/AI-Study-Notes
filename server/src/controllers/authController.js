const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: generate signed JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide name, email, and password.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'An account with this email already exists.',
      });
    }

    // Only allow valid roles; default to Student if not provided
    const allowedRoles = ['Student', 'Teacher', 'Admin'];
    const assignedRole = allowedRoles.includes(role) ? role : 'Student';
    const isApproved = assignedRole !== 'Teacher'; // Teachers require Admin approval

    const user = await User.create({
      name,
      email,
      passwordHash: password, // pre-save hook will hash this
      role: assignedRole,
      isApproved,
    });

    if (!isApproved) {
      return res.status(201).json({
        status: 'success',
        pendingApproval: true,
        message: 'Teacher registration received! Your account is pending Administrator approval before you can sign in.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: false,
          createdAt: user.createdAt,
        },
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: true,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user and return token
// @route   POST /api/v1/auth/signin
// @access  Public
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password.',
      });
    }

    // Explicitly select passwordHash (it is hidden by default)
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password.',
      });
    }

    if (user.role === 'Teacher' && user.isApproved === false) {
      return res.status(403).json({
        status: 'fail',
        pendingApproval: true,
        message: 'Your Teacher account is pending Administrator approval. Please wait for an Admin to activate your account.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Signed in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user (client discards token; server confirms)
// @route   POST /api/v1/auth/logout
// @access  Public
const logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully. Please discard your token on the client.',
  });
};

// @desc    Get current logged-in user profile
// @route   GET /api/v1/auth/profile
// @access  Protected
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      status: 'success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check that the current user has Admin role
// @route   GET /api/v1/auth/check-admin
// @access  Protected + Admin only
const checkAdmin = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `Welcome, Admin ${req.user.name}. Admin access confirmed.`,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// @desc    Get all teacher accounts pending approval
// @route   GET /api/v1/auth/pending-teachers
// @access  Protected + Admin only
const getPendingTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: 'Teacher', isApproved: false })
      .select('name email role isApproved createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: teachers.length,
      teachers,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve a pending teacher account
// @route   PATCH /api/v1/auth/approve-teacher/:id
// @access  Protected + Admin only
const approveTeacher = async (req, res, next) => {
  try {
    const teacher = await User.findById(req.params.id);

    if (!teacher || teacher.role !== 'Teacher') {
      return res.status(404).json({ status: 'fail', message: 'Teacher account not found.' });
    }

    teacher.isApproved = true;
    await teacher.save();

    res.status(200).json({
      status: 'success',
      message: `Teacher ${teacher.name} has been approved successfully.`,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        isApproved: teacher.isApproved,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject / delete a pending teacher registration
// @route   DELETE /api/v1/auth/reject-teacher/:id
// @access  Protected + Admin only
const rejectTeacher = async (req, res, next) => {
  try {
    const teacher = await User.findById(req.params.id);

    if (!teacher || teacher.role !== 'Teacher') {
      return res.status(404).json({ status: 'fail', message: 'Teacher account not found.' });
    }

    await teacher.deleteOne();

    res.status(200).json({
      status: 'success',
      message: `Teacher registration for ${teacher.name} has been rejected and removed.`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  signin,
  logout,
  getProfile,
  checkAdmin,
  getPendingTeachers,
  approveTeacher,
  rejectTeacher,
};
