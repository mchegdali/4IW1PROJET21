import brevo from '@getbrevo/brevo';
const apiInstance = new brevo.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const templateIds = {
  confirmation: 1,
};

/**
 *
 * @param {object} user
 * @param {string} user.email
 * @param {string} user.fullname
 * @param {string} confirmationToken
 */
export async function sendConfirmationEmail(user, confirmationToken) {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  const url = new URL('/confirm', process.env.APP_URL);
  url.searchParams.append('token', confirmationToken);
  sendSmtpEmail.to = [
    {
      email: user.email,
      name: user.fullname,
    },
  ];
  sendSmtpEmail.templateId = templateIds.confirmation;
  sendSmtpEmail.params = {
    FULLNAME: user.fullname,
    TOKEN_URL: url.toString(),
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    if (error instanceof brevo.HttpError) {
      console.log('HttpError statusCode', error.statusCode);
      console.log('HttpError body', error.body);
    }
    throw error;
  }
}
