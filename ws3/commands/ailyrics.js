const axios = require("axios");
const name = "genlyrics";

module.exports = {
  name,
  description: "Creates a lyric by AI, based how you prompt",
  async run({ api, send, args }) {
    const prompt = args.join(" ");
    if (!prompt) return send(`Usage: ${api.prefix + name} [your desired prompt]`);
    send("This will take a few minutes, please wait...");
    try {
      const res = await axios.get(api.api_josh + "/api/ailyrics", {
        params: {
          prompt
        }
      });
      if (!res) throw new Error();
      const result = res.data.result;
      send(result);
    } catch (error) {
      send("Error while generating your request. Please try again or try another prompt.\n" + error.message || error);
    }
  }
}