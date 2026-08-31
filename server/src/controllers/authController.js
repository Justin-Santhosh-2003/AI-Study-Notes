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

    const user = await User.create({
      name,
      email,
      passwordHash: password, // pre-save hook will hash this
      role: assignedRole,
    });

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

module.exports = { signup, signin, logout, getProfile, checkAdmin };
