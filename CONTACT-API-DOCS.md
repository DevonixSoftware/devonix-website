# Contact Us API Documentation

## Overview
The Contact Us feature provides a secure form submission system that sends emails to the company inbox using SendGrid. It includes multiple backend implementations (Node.js, PHP, Python, .NET) with consistent API endpoints.

## Frontend Integration

### HTML Form
```html
<form class="contact-form" id="contactForm">
    <input type="text" name="name" placeholder="Name" required>
    <input type="text" name="company" placeholder="Company" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="tel" name="phone" placeholder="Phone" required>
    <textarea name="message" placeholder="Message" required></textarea>
    <input type="hidden" name="recaptchaToken" id="recaptchaToken">
    <button type="submit" class="btn btn-primary">Send Message</button>
</form>
```

### JavaScript Integration
```javascript
// Include reCAPTCHA script in head
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_RECAPTCHA_SITE_KEY"></script>

// Form submission handler
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Client-side validation
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Get reCAPTCHA token
    const token = await grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', { action: 'submit' });
    data.recaptchaToken = token;

    // Send to backend
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
        alert('Thank you for your message!');
        this.reset();
    } else {
        alert('Error: ' + result.error);
    }
});
```

## API Endpoint

### POST /api/contact

**Content-Type:** `application/json`

**Rate Limit:** 5 requests per 15 minutes per IP

**Request Body:**
```json
{
  "name": "John Doe",
  "company": "ABC Corp",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "message": "I am interested in your web development services.",
  "recaptchaToken": "recaptcha_response_token_here"
}
```

**Success Response (200):**
```json
{
  "message": "Message sent successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors or reCAPTCHA failure
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Backend Implementations

### Node.js (Express)
**Files:** `backend-node/server.js`, `backend-node/package.json`

**Dependencies:**
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.10.0",
  "@sendgrid/mail": "^7.7.0",
  "axios": "^1.5.0"
}
```

**Environment Variables:**
- `SENDGRID_API_KEY`: Your SendGrid API key
- `RECAPTCHA_SECRET_KEY`: Your reCAPTCHA secret key
- `PORT`: Server port (default: 3001)

**Run:**
```bash
cd backend-node
npm install
npm start
```

### PHP
**File:** `backend-php/contact.php`

**Requirements:**
- PHP 7.4+
- cURL extension

**Environment Variables:**
- `SENDGRID_API_KEY`
- `RECAPTCHA_SECRET_KEY`

**Deployment:**
Deploy to any PHP-enabled web server. Ensure environment variables are set via `.htaccess` or server configuration.

### Python (Flask)
**Files:** `backend-python/app.py`, `backend-python/requirements.txt`

**Dependencies:**
```
Flask==2.3.3
Flask-CORS==4.0.0
Flask-Limiter==3.5.0
requests==2.31.0
sendgrid==6.10.0
```

**Environment Variables:**
- `SENDGRID_API_KEY`
- `RECAPTCHA_SECRET_KEY`
- `FLASK_ENV`: Set to 'production' for production

**Run:**
```bash
cd backend-python
pip install -r requirements.txt
python app.py
```

### .NET 6
**Files:** `backend-dotnet/ContactApi.csproj`, `backend-dotnet/Program.cs`, `backend-dotnet/Controllers/ContactController.cs`, `backend-dotnet/appsettings.json`

**Dependencies:**
- SendGrid NuGet package
- ASP.NET Core 6.0

**Configuration (appsettings.json):**
```json
{
  "SENDGRID_API_KEY": "your_sendgrid_api_key",
  "RECAPTCHA_SECRET_KEY": "your_recaptcha_secret_key"
}
```

**Run:**
```bash
cd backend-dotnet
dotnet restore
dotnet run
```

## Email Template
All backends use the same HTML email template:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563eb;">New Contact Form Submission</h2>
  <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3>Contact Details:</h3>
    <p><strong>Name:</strong> [Name]</p>
    <p><strong>Company:</strong> [Company]</p>
    <p><strong>Email:</strong> [Email]</p>
    <p><strong>Phone:</strong> [Phone]</p>
  </div>
  <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
    <h3>Message:</h3>
    <p style="white-space: pre-wrap;">[Message]</p>
  </div>
  <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
    This email was sent from the Devonix contact form.
  </p>
</div>
```

## Setup Instructions

### 1. Google reCAPTCHA v3
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Register a new site
3. Choose reCAPTCHA v3
4. Add your domain(s)
5. Get your Site Key and Secret Key

### 2. SendGrid Setup
1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Generate an API key
3. Verify your sender email (noreply@devonix.com recommended)
4. Set up domain authentication if using custom domain

### 3. Environment Variables
Set the following environment variables for your chosen backend:

```bash
# Replace with your actual keys
export SENDGRID_API_KEY="SG.your_sendgrid_api_key_here"
export RECAPTCHA_SECRET_KEY="your_recaptcha_secret_key_here"
```

### 4. Frontend Configuration
Update the reCAPTCHA script in `index.html`:
```html
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
```

Update the JavaScript in `script.js`:
```javascript
const token = await grecaptcha.execute('YOUR_SITE_KEY', { action: 'submit' });
```

## Testing

### Manual Testing
1. Start your backend server
2. Open the HTML page in a browser
3. Fill out and submit the contact form
4. Verify email receipt at devonix.sa@gmail.com

### API Testing with cURL
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "company": "Test Company",
    "email": "test@example.com",
    "phone": "+1234567890",
    "message": "This is a test message.",
    "recaptchaToken": "test_token"
  }'
```

### Rate Limiting Test
```bash
# This should work
curl -X POST http://localhost:3001/api/contact -H "Content-Type: application/json" -d '{"name":"Test","company":"Test","email":"test@test.com","phone":"123","message":"Test","recaptchaToken":"test"}'

# Wait 15 minutes or change IP, then try again
```

## Security Features

- **reCAPTCHA v3**: Prevents automated spam submissions
- **Rate Limiting**: 5 submissions per 15 minutes per IP address
- **Input Validation**: Both client-side and server-side validation
- **CORS**: Configured for cross-origin requests
- **Security Headers**: Helmet middleware in Node.js backend
- **XSS Protection**: HTML encoding in email templates

## Production Deployment

### Node.js
- Use PM2 for process management
- Set up reverse proxy with Nginx
- Configure SSL certificates
- Use environment variables for secrets

### PHP
- Deploy to shared hosting or VPS
- Use Apache/Nginx with PHP-FPM
- Set environment variables in server config

### Python
- Use Gunicorn for production
- Set up reverse proxy
- Configure environment variables

### .NET
- Publish to IIS or use Kestrel
- Configure appsettings.Production.json
- Set up Windows/Linux service

## Troubleshooting

### Common Issues

1. **reCAPTCHA not working**
   - Verify site key in HTML script tag
   - Check secret key in backend
   - Ensure domain is registered in reCAPTCHA console

2. **Emails not sending**
   - Verify SendGrid API key
   - Check sender email verification
   - Review SendGrid activity feed for errors

3. **Rate limiting triggered**
   - Wait 15 minutes or test from different IP
   - Check server logs for rate limit messages

4. **CORS errors**
   - Ensure backend has CORS configured
   - Check request origin matches allowed origins

### Logs
- Node.js: Console output or Winston logs
- PHP: Server error logs
- Python: Flask app logger
- .NET: Serilog or built-in logging

## Support
For issues with this Contact Us implementation, check:
1. Backend server logs
2. Browser developer console
3. SendGrid activity feed
4. reCAPTCHA admin console
