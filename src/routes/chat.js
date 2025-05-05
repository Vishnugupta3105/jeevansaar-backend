const express = require('express');
const router = express.Router();
const { generateTextResponse } = require('../utils/openai');

// Store chat history in memory (in production, use a database)
const chatHistory = new Map();

router.post('/chat', async (req, res) => {
  try {
    const { message, personality } = req.body;
    
    if (!message || !personality) {
      return res.status(400).json({ error: 'Message and personality are required' });
    }

    console.log('Received chat request:', { message, personality });
    
    // Get or initialize chat history for this personality
    if (!chatHistory.has(personality)) {
      chatHistory.set(personality, []);
    }
    
    const history = chatHistory.get(personality);
    
    // Add user message to history
    history.push({ role: 'user', content: message });
    
    // Generate response
    const response = await generateTextResponse(message, personality);
    
    // Add bot response to history
    history.push({ role: 'assistant', content: response });
    
    // Keep only last 10 messages to manage memory
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }
    
    console.log('Generated response:', response);
    
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Get chat history for a personality
router.get('/history/:personality', (req, res) => {
  const { personality } = req.params;
  const history = chatHistory.get(personality) || [];
  res.json({ history });
});

// Clear chat history for a personality
router.delete('/history/:personality', (req, res) => {
  const { personality } = req.params;
  chatHistory.delete(personality);
  res.json({ message: 'Chat history cleared' });
});

module.exports = router; 