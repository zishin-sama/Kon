module.exports = {
  name: "id",
  description: "Check your user ID while on a page bot",
  async run({
    api,
    event,
    send
  }) {
    return send(`Your ID: ${event.sender.id}`);
  }
}
