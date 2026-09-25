const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure transporter (FIXED: use createTransport)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
    }
});

// Optional: verify transporter config
transporter.verify((error, success) => {
    if (error) {
        console.error('Transporter setup failed:', error);
    } else {
        console.log('Nodemailer ready to send emails');
    }
});

// Password reset email HTML template
const createResetEmailTemplate = (userName, resetLink) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #f2f2f2; padding: 0; margin: 0; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; }
        .header { background: #2e7d32; color: white; padding: 30px; text-align: center; }
        .content { padding: 40px; background: #f9f9f9; }
        .button { display: inline-block; background: #2e7d32; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
        .footer { text-align: center; padding: 20px; font-size: 14px; color: #666; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌱 ZeroWasteMart</h1>
            <p>Password Reset Request</p>
        </div>
        <div class="content">
            <h2>Hello ${userName},</h2>
            <p>We received a request to reset your password for your ZeroWasteMart account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
                <a href="${resetLink}" class="button">🔐 Reset Password</a>
            </div>
            <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 24 hours for security reasons.
            </div>
            <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
            <p>If you're having trouble with the button, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetLink}</p>
        </div>
        <div class="footer">
            <p>This email was sent from ZeroWasteMart. Please do not reply to this email.</p>
            <p>Need help? Contact us at support@zerowastemart.com</p>
            <p>© 2025 ZeroWasteMart. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

// Send email endpoint
app.post('/api/send-reset-email', async (req, res) => {
    const { email, userName, resetLink } = req.body;

    // Validate request
    if (!email || !userName || !resetLink) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }

    // Email options
    const mailOptions = {
        from: process.env.GMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Reset Your ZeroWasteMart Password',
        html: createResetEmailTemplate(userName, resetLink)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);

        return res.json({
            success: true,
            message: 'Password reset email sent successfully',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'ZeroWasteMart Email Service',
        timestamp: new Date().toISOString()
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Email service running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
