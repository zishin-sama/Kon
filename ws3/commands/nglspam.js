const axios = require("axios");

module.exports = {
  name: "nglspam",
  description: "Spam a message to an NGL profile",
  async run({ api, event, send, args }) {
    const input = args.join(" ").split("|").map(part => part.trim());

    if (input.length !== 3) {
      return send("Please provide a valid username, message, and amount. Example usage: nglspam <username> | <message> | <amount>");
    }

    const [username, message, amount] = input;

    const amountNumber = parseInt(amount);
    if (isNaN(amountNumber) || amountNumber <= 0 || amountNumber > 100) {
      return send("Please provide a valid number for the amount between 1 and 100.");
    }

    try {
      const response = await axios.get(`https://nglspammer-kjpg.onrender.com/ngl?u=${encodeURIComponent(username)}&m=${encodeURIComponent(message)}&a=${amountNumber}`);
      const { status, success } = response.data.result;

      if (status === "success") {
        send(`Successful NGL spam to ${username} ${success} out of ${amountNumber} times.`);
      } else {
        send("An error occurred with the spam request. Please try again.");
      }
    } catch (error) {
      console.error("Error calling NGL Spam API:", error);
      send("Failed to spam. An error occurred.");
    }
  },
};