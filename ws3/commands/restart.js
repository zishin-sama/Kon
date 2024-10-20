const fs = require("fs");

module.exports = {
description: "To restart the bot, admin access only",
admin: true,
async run({
  api,
  event,
  send,
  admin
}){
    const rsFile = api.temp + "/restart";
    if (!admin) return send("Admin access only.");
    send("Bot is restarting...");
    fs.writeFileSync(rsFile, JSON.stringify({
      restartId: event.sender.id,
      time: Date.now()
    }, null, 4));
    setTimeout(() => process.exit(1), 2*1000);
  }
}