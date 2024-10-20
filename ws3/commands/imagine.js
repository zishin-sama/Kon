const { ApexImagine } = require("apexify.js");

const model = 'prodia'; // AI model (e.g., 'dalle', 'simurg', 'flux-pro', etc.)

module.exports = {
  name: "imagine",
  description: "Generate an image based on user input.",
  async run({ api, event, args, send }) {
    const [mainPrompt, negativePrompt] = args.join(" ").split("|").map(prompt => prompt.trim());

    // Image generation options
    const imageOptions = {
      count: 1,
      nsfw: false,
      deepCheck: false,
      nsfwWords: [],
      Api_key: '2b0e03f0-b307-4966-b060-cbb4186ebfe8',
      negative_prompt: negativePrompt || "",
      sampler: "DPM++ 2M Karras",
      height: 512,
      width: 512,
      cfg_scale: 9,
      steps: 20,
      seed: -1,
      image_style: "cinematic"
    };

    // Check if the main prompt is provided
    if (!mainPrompt) {
      return send("Please provide a prompt to generate.");
    }

    try {
      const imageResponse = await ApexImagine(model, mainPrompt, imageOptions);
      const imageUrl = imageResponse[0];

      await send({
        attachment: {
          type: "image",
          payload: {
            url: imageUrl,
            is_reusable: true
          }
        }
      });
    } catch (error) {
      console.error('Error generating image:', error);
      send('An error occurred while generating the image. Please try again later.');
    }
  }
};
