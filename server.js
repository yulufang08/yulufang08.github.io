const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

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
