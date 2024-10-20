module.exports = {
  description: "What is KonAI",
  async run({ api, send, admin }) {
    await send({
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `Hello! I\'m KonAI, your friendly personal assistant here to help you with your questions and tasks. Whether you need information, recommendations, or just someone to chat with, I\'m here for you!

If you encounter any issues or have feedback, please don\'t hesitate to reach out to my admin. Thank you for choosing me as your assistant!`,
          buttons: [
            {
              type: "web_url",
              url: "https://www.facebook.com/assistant.kon",
              title: "Like/Follow our Page"
            },
            {
              type: "web_url",
              url: "https://www.facebook.com/it.zishin",
              title: "Contact Admin"
            }
          ]
        }
      }
    });
  }
};
