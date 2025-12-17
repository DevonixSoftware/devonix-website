// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Env variables (استخدم dotenv للافضل)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'devonix.sa@gmail.com';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5,
  message: { error: 'Too many requests from this IP, try again later.' }
});
app.use('/api/contact', limiter);

// reCAPTCHA v3 verification
async function verifyRecaptcha(token) {
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: token
        }
      }
    );
    return response.data.success && response.data.score > 0.5;
  } catch (err) {
    console.error('reCAPTCHA verification error:', err);
    return false;
  }
}

// Email template
function createEmailTemplate(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color:#2563eb;">New Contact Form Submission</h2>
      <div style="background-color:#f9fafb; padding:20px; border-radius:8px; margin:20px 0;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
      </div>
      <div style="background-color:#ffffff; padding:20px; border:1px solid #e5e7eb; border-radius:8px;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${data.message}</p>
      </div>
    </div>
  `;
}

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, company, email, phone, message, recaptchaToken } = req.body;

    if (!name || !company || !email || !phone || !message || !recaptchaToken) {
      return res.status(400).json({ error: 'All fields are required including reCAPTCHA token.' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format.' });

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]{6,20}$/;
    if (!phoneRegex.test(phone)) return res.status(400).json({ error: 'Invalid phone number.' });

    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) return res.status(400).json({ error: 'reCAPTCHA verification failed.' });

    // SendGrid
    sgMail.setApiKey(SENDGRID_API_KEY);

    const msg = {
      to: COMPANY_EMAIL,
      from: {
        email: 'noreply@devonix.com',
        name: 'Devonix Contact Form'
      },
      subject: `New Contact Form Submission from ${name}`,
      html: createEmailTemplate(req.body),
    };

    await sgMail.send(msg);
    res.json({ message: 'Message sent successfully ✅' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
