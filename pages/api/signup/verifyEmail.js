const Cookies = require('cookies');
const { encrypt, decrypt } = require('helpers/encrypt');

import signupController from 'controllers/signupController';

/**
 * When the user clicks the link to verify their email,
 * this decodes the username from the url and sets a cookie
 * that, when the browser sees it, will direct them
 * to re-enter their password
 */

let result, payload;

export default async function verifyEmail(req, res) {

  const { username } = req.query;

  /* decode and decrypt the username */
  const decoded = decodeURIComponent(username);
  const decryptedUsername = decrypt(decoded);

  /* set a cookie in the browser so it loads the re-enter password screen */
  const cookies = new Cookies(req, res);
  cookies.set('reset_password'); // clears it
  cookies.set('sent_verification'); // clears it
  cookies.set('authenticated', decryptedUsername);

  /* Authenticate user in db */
  payload = { username: decryptedUsername };
  result = await signupController.authenticateUser(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json(result.end);
  };

  /* Has to redirect to main page */
  /* The main page should see the new cookie and proceed accordingly */
  return res.redirect('/');
};
