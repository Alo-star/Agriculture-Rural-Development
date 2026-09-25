# EmailJS Setup Guide for ZeroWasteMart Password Reset

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/) and sign up for a free account
2. Verify your email address

## Step 2: Add Email Service (Gmail)

1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" from the list
4. Connect your Gmail account
5. Note down your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Use this template:

**Subject:** Reset Your ZeroWasteMart Password

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2e7d32; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ZeroWasteMart</h1>
            <p>Password Reset Request</p>
        </div>
        <div class="content">
            <h2>Hello {{to_name}},</h2>
            <p>We received a request to reset your password for your ZeroWasteMart account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="{{reset_link}}" class="button">Reset Password</a>
            <p><strong>This link will expire in {{expiry_time}}.</strong></p>
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all; color: #666;">{{reset_link}}</p>
        </div>
        <div class="footer">
            <p>This email was sent from ZeroWasteMart. Please do not reply to this email.</p>
            <p>If you have any questions, contact our support team.</p>
        </div>
    </div>
</body>
</html>
```

4. Save the template and note down your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Your Public Key

1. Go to "Account" → "API Keys" in EmailJS dashboard
2. Copy your **Public Key** (e.g., `user_abc123def456`)

## Step 5: Update Your Code

Replace the placeholders in `login.html`:

```javascript
// Replace YOUR_PUBLIC_KEY with your actual public key
emailjs.init("user_abc123def456");

// Replace YOUR_SERVICE_ID with your Gmail service ID
emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

## Step 6: Test the Integration

1. Create a test user account
2. Try the "Forgot Password" feature
3. Check if the email is received in your Gmail inbox

## Troubleshooting

### Email not sending:
- Check if your Gmail account has "Less secure app access" enabled
- Verify your EmailJS service is properly connected
- Check browser console for error messages

### Email going to spam:
- Add your domain to Gmail's safe senders list
- Use a professional email template
- Include proper headers and authentication

## Security Notes

- The reset token expires after 24 hours
- Tokens are stored securely in localStorage (in production, use a database)
- Each token can only be used once
- Failed attempts are logged for security monitoring

## Production Considerations

For production deployment:
1. Use environment variables for API keys
2. Implement rate limiting for password reset requests
3. Add CAPTCHA for additional security
4. Use HTTPS for all communications
5. Consider using a dedicated email service like SendGrid or AWS SES

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Basic templates
- Gmail, Outlook, and other email services

For higher volume, consider upgrading to a paid plan. 