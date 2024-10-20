const axios = require("axios");
const Kon = require("unlimited-ai");

module.exports = {
  name: "aikon",
  description: "Interact with Kon AI",
  async run ({ api, event, send, args }) {
    const prompt = args.join(" ");

    // Define a list of random responses when the prompt is missing
    const missingPromptResponses = [
      "Hi, I am Kon! How can I assist you today?",
      "Hello! What do you need help with?",
      "Hey there! Ask me anything, I’m ready to assist.",
      "I'm here to help! Please ask your question or provide a prompt.",
      "Kon at your service! Feel free to type your question or prompt."
    ];

    // Improved system prompt for better responses
    const system = `
      You are an AI assistant named Kon. 
      You should always introduce yourself as Kon, a helpful assistant
      Your responses should be concise and easy to understand.
      You speak in simple English, Filipino, Bisaya and always stay on topic, providing useful information. 
      Be friendly and helpful, avoiding complex explanations or unfamiliar words.
    `;

    // Check if prompt is missing
    if (!prompt) {
      // Send a random response from the missingPromptResponses list
      const randomResponse = missingPromptResponses[Math.floor(Math.random() * missingPromptResponses.length)];
      return send(randomResponse);
    }

    try {
      const model = 'gpt-4-turbo-2024-04-09';
      const messages = [ 
        { role: "user", content: prompt }, 
        { role: "system", content: system } 
      ];

      const response = await Kon.generate(model, messages);
      const text = response.content;
    
      // Split the response into chunks if it exceeds 2000 characters
      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          send(message);
        }
      } else {
        send(text);
      }
    } catch (error) {
      console.error('Error calling GPT-4 API:', error);
      send('An error occurred, please try again.');
    }
  }
};

// Helper function to split messages into chunks
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
