import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
import signupController from 'controllers/signupController';
const { decrypt } = require('utils/encrypt');

/**
 * When the user clicks the link INSIDE EMAIL that verifies them
 * - sets a cookie that, when the browser sees it, 
 * redirects them to re-enter their password
 */

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {

  const { username } = req.query;

  /* decode and decrypt the username */
  const decoded = decodeURIComponent(username);
  const decryptedUsername = decrypt(decoded);

  /* set a cookie in the browser so it loads the re-enter password screen */
  res.cookie('reset_password'); // clears it
  res.cookie('sent_verification'); // clears it
  res.cookie('authenticated', decryptedUsername);

  res.locals.username = decryptedUsername;

  /* Authenticate user in db */
  await signupController.authenticateUser(req, res, next);
})

// Return
handler.use((req, res) => {
  /* The main page should see the new cookie and proceed accordingly */
  return res.redirect('/');
})

export default handler;
