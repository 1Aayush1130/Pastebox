const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// @POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ error: 'User already exists with that email or username' });

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, plan: user.plan, storageUsed: user.storageUsed, storageLimit: user.storageLimit }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, plan: user.plan, storageUsed: user.storageUsed, storageLimit: user.storageLimit }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  const user = req.user;
  res.json({ id: user._id, username: user.username, email: user.email, plan: user.plan, storageUsed: user.storageUsed, storageLimit: user.storageLimit, createdAt: user.createdAt });
});

module.exports = router;
