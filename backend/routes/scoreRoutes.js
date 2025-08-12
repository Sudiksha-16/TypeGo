const express = require('express');
const Score = require('../models/Score');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Submit Score
router.post('/submit-score', authenticateToken, async (req, res) => {
  try {
    const { wpm, accuracy } = req.body;
    if (!wpm || !accuracy) return res.status(400).json({ error: 'All fields are required' });

    const newScore = new Score({ username: req.user.username, wpm, accuracy });
    await newScore.save();

    res.json({ message: 'Score saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Leaderboard
router.get('/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ wpm: -1, date: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
