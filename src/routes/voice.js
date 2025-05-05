const express = require('express');
const formidable = require('formidable');
const { VoiceServer } = require('../utils/voiceServer');

const router = express.Router();

// Note: VoiceServer instance is created in server.js and passed to routes if needed
router.post('/start', (req, res) => {
  try {
    const { personality } = req.body;
    
    if (!personality) {
      return res.status(400).json({ error: 'Personality is required' });
    }

    // Start voice chat session
    // Note: VoiceServer instance is managed by server.js
    res.json({ status: 'Voice chat session started' });
  } catch (error) {
    console.error('Voice chat error:', error);
    res.status(500).json({ error: 'Failed to start voice chat session' });
  }
});

// Handle audio upload
router.post('/upload', (req, res) => {
  const form = formidable({ 
    multiples: false,
    maxFileSize: 5 * 1024 * 1024 // 5MB limit
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Error parsing audio file' });
    }

    if (!files.audio) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    try {
      const audioFile = files.audio;
      const personality = fields.personality;

      // Process the audio file
      // Note: VoiceServer instance is managed by server.js
      res.json({ status: 'Audio received' });
    } catch (error) {
      console.error('Audio processing error:', error);
      res.status(500).json({ error: 'Failed to process audio' });
    }
  });
});

module.exports = router; 