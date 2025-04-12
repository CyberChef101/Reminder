const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI);

const reminderSchema = new mongoose.Schema({
    dateTime: Date,
    message: String
});
const Reminder = mongoose.model('Reminder', reminderSchema);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/set-reminder', async (req, res) => {
    const { reminderDate, reminderTime, reminderMessage } = req.body;
    const dateTime = new Date(`${reminderDate}T${reminderTime}:00`);
    const reminder = new Reminder({ dateTime, message: reminderMessage });
    await reminder.save();
    res.send('Reminder set successfully!');
});

cron.schedule('* * * * *', async () => {
    const now = new Date();
    const reminders = await Reminder.find();
    reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.dateTime);
        if (reminderTime <= now) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'your_email@gmail.com',
                subject: 'Reminder',
                text: reminder.message
            };
            transporter.sendMail(mailOptions);
            Reminder.deleteOne({ _id: reminder._id }).then(() => {
                console.log('Reminder sent and removed');
            });
        }
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));