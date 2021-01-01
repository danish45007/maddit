const mailgun = require("mailgun-js");
const DOMAIN = process.env.Mailgun_Domain;

const sendMail = (
  receiver: string,
  source: string,
  subject: string,
  content: any
) => {
  try {
    const mg = mailgun({
      apiKey: process.env.Mailgun_API_KEY,
      domain: DOMAIN,
    });
    const data = {
      from: receiver,
      to: source,
      subject: subject,
      text: content,
    };
    return mg.messages().send(data, function (error: any, body: any) {
      if (error) {
        console.log(error);
      }
      console.log(body);
    });
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;
