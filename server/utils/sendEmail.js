const mailer = require("nodemailer");
const mailerConfig = require("./nodemailerConfig");

const sendMail = async ({ to, subject, html }) => {
  // Create transporter
  const transporter = mailer.createTransport(mailerConfig);

  // Send email
  return transporter.sendMail(
    {
      from: '"Node Pizza" <nodemailer.tmv@gmail.com>',
      to,
      subject,
      html,
    },
    (err, info) => {
      if (err) return console.log(err);
    }
  );
};

module.exports = sendMail;
