const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  email: String,
  date: Date,
  message: String,
  sent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Reminder', reminderSchema);
