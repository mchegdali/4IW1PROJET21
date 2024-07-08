const brevo = require('@getbrevo/brevo');
const apiInstance = new brevo.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const templateIds = {
  confirmation: 1,
  forgotPassword: 2,
};

/**
 *
 * @param {object} user
 * @param {string} user.email
 * @param {string} user.fullname
 * @param {number} templateId
 * @param {object} params
 */
async function sendEmail(user, templateId, params) {
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.headers.sendSmtpEmail.to = [
    {
      email: user.email,
      name: user.fullname,
    },
  ];
  sendSmtpEmail.templateId = templateId;
  sendSmtpEmail.params = params;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    if (error instanceof brevo.HttpError) {
      console.log('HttpError statusCode', error.statusCode);
      console.log('HttpError body', error.body);
    }

    console.log(error);
    throw error;
  }
}

/**
 *
 * @param {object} user
 * @param {string} user.email
 * @param {string} user.fullname
 * @param {string} confirmationToken
 */
async function sendConfirmationEmail(user, confirmationToken) {
  const url = new URL('/confirm', process.env.APP_URL);
  url.searchParams.append('token', confirmationToken);

  console.log(url.toString());
  await sendEmail(user, templateIds.confirmation, {
    TOKEN_URL: url.toString(),
    FULLNAME: user.fullname,
  });
}

/**
 *
 * @param {object} user
 * @param {string} user.email
 * @param {string} user.fullname
 * @param {string} forgotPasswordToken
 */
async function sendForgotPasswordEmail(user, forgotPasswordToken) {
  const url = new URL('/reset-password', process.env.APP_URL);
  url.searchParams.append('token', forgotPasswordToken);
  await sendEmail(user, templateIds.forgotPassword, {
    TOKEN_URL: url.toString(),
    FULLNAME: user.fullname,
  });
}

module.exports = { sendConfirmationEmail, sendForgotPasswordEmail, sendEmail };
