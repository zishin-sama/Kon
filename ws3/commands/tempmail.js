const { TempMail } = require("1secmail-api");
const name = "tempmail";

function generateRandomId() {
  const length = 6;
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';

  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomId;
}

module.exports = {
  name,
  description: "Generate temporary email (auto get inbox)",
  async run({ api, event, send }) {
    try {
      // Generate temporary email
      const mail = new TempMail(generateRandomId());

      // Auto fetch
      mail.autoFetch();

      // Send the temporary email address
      send(`Your temporary email is: ${mail.address}`);

      // Fetch function
      const fetch = async () => {
        const mails = await mail.getMail();
        if (!mails[0]) {
          return;
        } else {
          const b = mails[0];
          const msg = `You have a message!\n\nFrom: ${b.from}\n\nSubject: ${b.subject}\n\nMessage: ${b.textBody}\nDate: ${b.date}`;
          send(msg + `\n\nOnce the email and message are received, they will be automatically deleted.`);
          await mail.deleteMail();
        }
      };

      // Auto fetch every 3 seconds
      fetch();
      setInterval(fetch, 3 * 1000);

    } catch (err) {
      console.log(err);
      send('An error occurred: ' + err.message);
    }
  }
};
