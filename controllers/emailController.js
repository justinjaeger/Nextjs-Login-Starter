const { encrypt, decrypt } = require('utils/encrypt');
const mailHelper = require('utils/mailHelper');

const emailController = {};

let result, query, payload;
/*************************************/

emailController.sendVerificationEmail = (req, res, payload) => {

  const { email, username } = payload;

  /* Create the URL that takes the user to reset password page */
  const DEV_ROUTE = process.env.DEV_ROUTE;
  const encryptedUsername = encrypt(username); // encrypts username so we can safetly use it in url
  const encodedUsername = encodeURIComponent(encryptedUsername); // encodes it because encryption will put weird characters in that will otherwise mess up the route
  const url = `${DEV_ROUTE}/api/signup/verifyEmail/?username=${encodedUsername}`;

  /* utilizes the helper function */
  const { transport, emailVerificationOptions } = mailHelper(email, url, username);

  /* Actually sends the email */
  result = transport.sendMail(emailVerificationOptions);
  if (result.error) return { end: result.error };

  return {};
};

/*************************************/

emailController.sendResetPasswordEmail = (req, res, payload) => {

  const { email } = payload;

  /* Create the URL that takes the user to reset password page */
  const DEV_ROUTE = process.env.DEV_ROUTE;
  const encryptedEmail = encrypt(email); // encrypts username so we can safetly use it in url
  const encodedEmail = encodeURIComponent(encryptedEmail); // encodes it because encryption will put weird characters in that will otherwise mess up the route
  const url = `${DEV_ROUTE}/api/login/servePassResetPage/?email=${encodedEmail}`;

  /* utilizes the mail helper function */
  const { transport, passwordResetOptions } = mailHelper(email, url);
  
  /* Actually sends the email */
  result = transport.sendMail(passwordResetOptions);
  if (result.error) return { end: result.error };

  return {};
};

/*************************************/


module.exports = emailController;