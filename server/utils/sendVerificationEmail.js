const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  email,
  name,
  verificationToken,
  origin,
}) => {
  const confirmationURL = `${origin}/api/v1/auth/verify-email?email=${email}&token=${verificationToken}`;

  const message = `<p>Ваш аккаунт создан, но еще не активирован. Для активации аккаунта пожалуйста пройдите по следующей ссылке: <a href="${confirmationURL}">ссылка подтверждения</a>.</p>`;

  return sendEmail({
    to: email,
    subject: "Node Pizza: Подтверждение аккаунта",
    html: `<h4>Здравствуйте, ${name}</h4>
  ${message}`,
  });
};

module.exports = sendVerificationEmail;
