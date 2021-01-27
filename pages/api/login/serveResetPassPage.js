const Cookies = require('cookies');
const { encrypt, decrypt } = require('helpers/encrypt');

/**
 * When the user clicks the link to reset their password,
 * this decodes the email from the url and sets a cookie
 * that, when the browser sees it, will direct them
 * to reset their password
 */

export default async function serveResetPassPage(req, res) {

  const { email } = req.query;

  /* decode and decrypt the email */
  const decoded = decodeURIComponent(email);
  const decryptedEmail = decrypt(decoded);

  /* set a cookie in the browser so it loads the reset password screen */
  const cookies = new Cookies(req, res);
  cookies.set('authenticated'); // clears it
  cookies.set('reset_password', `XXX${decryptedEmail}XXX`);

  /* Has to redirect to main page */
  /* The main page should see the new cookie and proceed accordingly */
  return res.redirect('/');
  
};
