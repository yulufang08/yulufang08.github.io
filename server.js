const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const emailConfig = require('./email-config');

const app = express();
const PORT = 3000;

// Email transporter
let transporter = null;
try {
  transporter = emailConfig.getTransporter();
} catch (error) {
  console.warn('⚠️  邮件服务初始化失败:', error.message);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Feedback file path
const feedbackFile = path.join(__dirname, 'feedback.json');

// Initialize feedback file if it doesn't exist
if (!fs.existsSync(feedbackFile)) {
  fs.writeFileSync(feedbackFile, JSON.stringify({ feedbacks: [] }, null, 2));
}

// API endpoint to receive feedback
app.post('/api/feedback', (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Read existing feedbacks
    const data = JSON.parse(fs.readFileSync(feedbackFile, 'utf8'));

    // Create new feedback object
    const newFeedback = {
      id: Date.now(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      userAgent: req.get('user-agent') || 'Unknown'
    };

    // Add to feedbacks array
    data.feedbacks.push(newFeedback);

    // Write back to file
    fs.writeFileSync(feedbackFile, JSON.stringify(data, null, 2));

    console.log(`[${new Date().toISOString()}] New feedback received:`, newFeedback.message);

    // Send email notification
    if (transporter) {
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .message-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
    .meta { color: #666; font-size: 12px; margin: 10px 0; }
    .footer { background: #f0f0f0; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📨 New Feedback Received</h2>
    </div>
    <div class="content">
      <p>You have received new anonymous feedback on your personal website.</p>

      <div class="message-box">
        <strong>💬 Feedback Content:</strong>
        <p>${newFeedback.message.replace(/\n/g, '<br>')}</p>
      </div>

      <div class="meta">
        <p><strong>⏰ Time:</strong> ${new Date(newFeedback.timestamp).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Shanghai'
        })} (CST)</p>
        <p><strong>🔑 Feedback ID:</strong> ${newFeedback.id}</p>
        <p><strong>📱 Device:</strong> ${newFeedback.userAgent}</p>
      </div>

      <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
        <strong>👀 View all feedbacks:</strong> <a href="http://localhost:3000/api/feedbacks">http://localhost:3000/api/feedbacks</a>
      </p>
    </div>
    <div class="footer">
      <p>This is an automated message from your Personal Website Feedback System</p>
    </div>
  </div>
</body>
</html>
      `;

      const mailOptions = {
        from: emailConfig.email.from,
        to: emailConfig.email.notifyEmail,
        subject: `🆕 New Feedback - ${new Date().toLocaleDateString('en-US')}`,
        html: emailHtml
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('❌ Failed to send email:', error.message);
        } else {
          console.log('✅ Email sent successfully:', info.response);
        }
      });
    } else {
      console.warn('⚠️  Email service not configured - skipping email notification');
    }

    res.json({
      success: true,
      message: 'Feedback saved successfully',
      feedbackId: newFeedback.id
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      error: 'Failed to save feedback',
      details: error.message
    });
  }
});

// Admin endpoint to view all feedbacks (optional - for your review)
app.get('/api/feedbacks', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(feedbackFile, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read feedbacks' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Personal Site Feedback Server Running   ║
╚════════════════════════════════════════════╝

📍 Server: http://localhost:${PORT}
📁 Feedback file: ${feedbackFile}
🔗 Feedback API: POST http://localhost:${PORT}/api/feedback
👀 View feedbacks: http://localhost:${PORT}/api/feedbacks

Press Ctrl+C to stop the server.
  `);
});
