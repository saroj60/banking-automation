const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'banking-automation-secret-key-123';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Admin login check
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Generate token
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' } // Session valid for 7 days
    );

    return res.json({
      token,
      user: { username: ADMIN_USERNAME, role: 'admin' }
    });
  } else {
    return res.status(401).json({ message: 'Invalid admin username or password' });
  }
});

// GET /api/auth/verify - Verify session token
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ valid: false });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ valid: false });

  try {
    jwt.verify(parts[1], JWT_SECRET);
    return res.json({ valid: true });
  } catch (err) {
    return res.status(401).json({ valid: false });
  }
});

module.exports = router;
