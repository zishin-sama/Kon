const axios = require("axios");
const { G4F } = require("g4f");
const name = "kon";

const conversationHistory = {};
const interactionTimeout = 3600000; 

module.exports = {
  name,
  description: "Interact with Kon AI",
  async run ({ api, event, send, args }) {
    const uid = event.sender.id;
    const prompt = args.join(" ");

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
      You should always introduce yourself as Kon, a helpful assistant.
      Your responses should be concise and easy to understand.
      You speak in simple English, Filipino, Bisaya and always stay on topic, providing useful information. 
      Be friendly and helpful, avoiding complex explanations or unfamiliar words.
    `;

    // Check if prompt is missing
    if (!prompt) {
      const randomResponse = missingPromptResponses[Math.floor(Math.random() * missingPromptResponses.length)];
      return send(randomResponse);
    }

    try {
      // Initialize conversation history and timestamp if it doesn't exist for this user
      if (!conversationHistory[uid]) {
        conversationHistory[uid] = { messages: [], lastInteraction: Date.now() };
      }

      // Update the last interaction timestamp
      conversationHistory[uid].lastInteraction = Date.now();

      // Append the user's message to their conversation history
      conversationHistory[uid].messages.push({ role: "user", content: prompt });

      // Create the conversation messages, including the user's history
      const messages = [
        { role: "system", content: system },
        ...conversationHistory[uid].messages // Include all previous messages from the user's history
      ];

      // GPT-4 request options
      const g4f = new G4F();
      const options = {
        provider: g4f.providers.GPT,
        model: "gpt-4",
        debug: true,
        proxy: ""
      };

      // Send the chat request to GPT-4 API
      const response = await g4f.chatCompletion(messages, options);
      const text = response.content;

      // Append the assistant's reply to the conversation history
      conversationHistory[uid].messages.push({ role: "assistant", content: text });

      // Split the response into chunks if it exceeds 2000 characters
      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const chunks = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of chunks) {
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

// Function to clean up inactive users
setInterval(() => {
  const currentTime = Date.now();

  for (const uid in conversationHistory) {
    const lastInteraction = conversationHistory[uid].lastInteraction;

    // If the user has been inactive for more than 1 hour, delete their history
    if (currentTime - lastInteraction > interactionTimeout) {
      delete conversationHistory[uid];
      console.log(`Deleted conversation history for user: ${uid} due to inactivity.`);
    }
  }
}, 60000); // Check every 60 seconds

// Helper function to split messages into chunks
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
