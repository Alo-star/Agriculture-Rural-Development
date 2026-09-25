# Backend Email Service Setup Guide

## Option 2: Node.js Backend with Nodemailer (Recommended for Production)

This setup uses a Node.js backend service with Nodemailer to send emails via Gmail.

### Step 1: Install Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

### Step 2: Configure Gmail

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### Step 3: Set Environment Variables

Create a `.env` file in the server directory:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
PORT=3001
```

### Step 4: Start the Email Service

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The service will start on `http://localhost:3001`

### Step 5: Test the Service

Test the health endpoint:
```bash
curl http://localhost:3001/api/health
```

### Step 6: Update Frontend Configuration

In `login-backend-version.html`, update the service URL:

```javascript
const EMAIL_SERVICE_URL = 'http://localhost:3001'; // Your server URL
```

### Step 7: Test Password Reset

1. Create a user account
2. Try the "Forgot Password" feature
3. Check your Gmail inbox for the reset email

## Security Features

- ✅ Gmail App Password (more secure than regular password)
- ✅ Environment variables for sensitive data
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting (can be added)

## Production Deployment

### Using Heroku:

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy the server code
4. Update frontend to use Heroku URL

### Using Vercel:

1. Install Vercel CLI
2. Deploy the server directory
3. Set environment variables in Vercel dashboard

### Using DigitalOcean/AWS:

1. Set up a server instance
2. Install Node.js and PM2
3. Deploy the application
4. Set up environment variables
5. Configure domain and SSL

## Troubleshooting

### Email not sending:
- Verify Gmail app password is correct
- Check if 2FA is enabled
- Ensure environment variables are set
- Check server logs for errors

### CORS errors:
- Verify the frontend URL is allowed in CORS configuration
- Check if the server is running on the correct port

### Environment variables not loading:
- Install dotenv: `npm install dotenv`
- Add `require('dotenv').config()` at the top of email-service.js

## Advantages of Backend Approach

1. **Better Security**: API keys and credentials stay on server
2. **More Control**: Custom email templates and logic
3. **Scalability**: Can handle high email volumes
4. **Monitoring**: Server-side logging and analytics
5. **Rate Limiting**: Prevent abuse of email service
6. **Professional**: More suitable for production applications

## Email Template Customization

The email template in `email-service.js` can be customized:

- Change colors and styling
- Add company logo
- Modify text content
- Add tracking links
- Include social media links

## Monitoring and Logging

Add logging to track email sending:

```javascript
// Add to email-service.js
const fs = require('fs');

// Log email attempts
const logEmailAttempt = (email, success, error = null) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        email: email,
        success: success,
        error: error
    };
    
    fs.appendFileSync('email-logs.json', JSON.stringify(logEntry) + '\n');
};
```

## Rate Limiting

Add rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many password reset requests, please try again later.'
});

app.use('/api/send-reset-email', emailLimiter);
```

This backend approach provides a more robust and scalable solution for production applications. 