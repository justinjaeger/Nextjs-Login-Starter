import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
const { decrypt } = require('utils/encrypt');

/**
 * When the user clicks "forgot password?"
 * 
 * - Decodes the email from the url
 * - sets a cookie that, when the browser sees it, 
 * will serve the reset password form
 */

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {
  
  const { email } = req.query;

  /* decode and decrypt the email */
  const decoded = decodeURIComponent(email);
  const decryptedEmail = decrypt(decoded);

  /* set a cookie in the browser so it loads the reset password screen */
  res.cookie('authenticated'); // clears it
  res.cookie('reset_password', decryptedEmail);
})

// Return
handler.use((req, res) => {
  return res.redirect('/');
})

export default handler;








export default async function serveResetPassPage(req, res) {

  const { email } = req.query;

  /* decode and decrypt the email */
  const decoded = decodeURIComponent(email);
  const decryptedEmail = decrypt(decoded);

  /* set a cookie in the browser so it loads the reset password screen */
  const cookies = new Cookies(req, res);
  cookies.set('authenticated'); // clears it
  cookies.set('reset_password', decryptedEmail);

  /* Has to redirect to main page */
  /* The main page should see the new cookie and proceed accordingly */
  return res.redirect('/');
  
};
