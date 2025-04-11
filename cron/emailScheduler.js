const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

cron.schedule('0 8 * * *', async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminders = await Reminder.find({ date: today, sent: false });

  reminders.forEach(async (reminder) => {
    await transporter.sendMail({
      from: `"Reminder Bot" <${process.env.EMAIL_USER}>`,
      to: reminder.email,
      subject: 'Your Scheduled Reminder',
      text: reminder.message
    });

    reminder.sent = true;
    await reminder.save();
  });
});
