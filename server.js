require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Reminder = require('./models/Reminder');
require('./cron/emailScheduler');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/api/reminder', async (req, res) => {
  const { email, date, message } = req.body;

  try {
    const reminder = new Reminder({ email, date: new Date(date), message });
    await reminder.save();
    res.status(200).json({ message: 'Reminder saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save reminder' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
