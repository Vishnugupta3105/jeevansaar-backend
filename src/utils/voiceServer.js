const WebSocket = require('ws');
const { generateTextResponse } = require('./openai');

class VoiceServer {
  constructor(server) {
    if (!server) {
      throw new Error('HTTP server instance is required');
    }
    
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log('New client connected');

      // Handle incoming audio data
      ws.on('message', async (data) => {
        try {
          // Process audio data and get AI response
          const response = await this.processAudio(data);
          
          // Send response back to client
          ws.send(JSON.stringify({
            type: 'response',
            data: response
          }));
        } catch (error) {
          console.error('Error processing audio:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Error processing audio'
          }));
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log('Client disconnected');
      });
    });
  }

  async processAudio(audioData) {
    try {
      // Convert audio to text using OpenAI Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: audioData,
        model: "whisper-1",
      });

      const userMessage = transcription.text;

      // Get AI response based on personality
      const aiResponse = await generateTextResponse(userMessage, 'friend'); // Default to friend personality

      // Convert AI response to speech
      const speech = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: aiResponse,
      });

      return {
        text: aiResponse,
        audio: speech
      };
    } catch (error) {
      console.error('Error in audio processing:', error);
      throw error;
    }
  }

  broadcast(message) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}

module.exports = { VoiceServer }; 