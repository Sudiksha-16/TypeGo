const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  username: String,
  wpm: Number,
  accuracy: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', ScoreSchema);
