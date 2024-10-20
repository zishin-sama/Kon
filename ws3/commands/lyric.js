const axios = require("axios");
const name = "lyrics";

module.exports = {
  name,
  description: "Fetch lyrics via song title",
  async run({ api, event, send, args }) {
    const songTitle = args.join(" ");

    // Check if song title is provided
    if (!songTitle) {
      return send("Please provide a song title to find lyrics...");
    }

    try {
      // API call to fetch lyrics
      const url = `${api.api_josh}/search/lyrics?q=${encodeURIComponent(songTitle)}`;
      const res = await axios.get(url);

      if (res.data && res.data.result) {
        const lyrics = res.data.result.lyrics;
        const title = res.data.result.title;
        const artist = res.data.result.artist;

        const responseMessage = `Title: ${title}\n\nArtist: ${artist}\n\nLyrics:\n\n${lyrics}`;
        send(responseMessage);
      } else {
        send("Lyrics not found for the specified song title.");
      }

    } catch (error) {
      console.error('Error fetching lyrics:', error);
      send('An error occurred while fetching the lyrics. Please try again.');
    }
  }
};
