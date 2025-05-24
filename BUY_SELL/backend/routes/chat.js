const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const formatChatHistory = (messages) => {
  if (messages[0]?.role === 'assistant') {
    return [];
  }
  
  return messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
};

router.post('/', auth, async (req, res) => {
  try {
    const { messages } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const context = "You are a helpful assistant for the IIIT Marketplace, a buy-sell platform for IIIT students. Help users with finding items, selling items, and understanding how the platform works.";

    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });

    if (messages.length <= 2) { 
      const result = await chat.sendMessage(context + "\n\n" + messages[messages.length - 1].content);
      const response = await result.response;
      return res.json({
        message: response.text()
      });
    }

    const chatHistory = formatChatHistory(messages.slice(1, -1)); 
    const newChat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });

    const latestMessage = messages[messages.length - 1].content;

    const result = await newChat.sendMessage(latestMessage);
    const response = await result.response;
    
    res.json({
      message: response.text()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

module.exports = router; 