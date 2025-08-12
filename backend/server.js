require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OpenAI } = require('openai');

// Ensure required environment variables are set
if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.OPENAI_API_KEY) {
  console.error('Missing required environment variables. Please check .env file.');
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

const ScoreSchema = new mongoose.Schema({
  username: String,
  wpm: Number,
  accuracy: Number,
  date: { type: Date, default: Date.now }
});
const Score = mongoose.model('Score', ScoreSchema);

// User Registration
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'All fields are required' });
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'All fields are required' });
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware for Authentication
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  const actualToken = token.split(' ')[1]; // Extract Bearer token
  jwt.verify(actualToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Generate Typing Test Text
const axios = require('axios');

app.post('/generate-text', async (req, res) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      { 
        inputs: `Generate a different random typing test paragraph ${Math.random()}.`,
        parameters: { temperature: 0.9 } // Higher temp → more varied responses
      },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );
    
    res.json({ text: response.data[0].generated_text.trim() });
  } catch (error) {
    console.error("Hugging Face API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Error generating text", details: error.message });
  }
});



// Submit Score
app.post('/submit-score', authenticateToken, async (req, res) => {
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

// Get Top Scores (Leaderboard)
app.get('/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ wpm: -1, date: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));