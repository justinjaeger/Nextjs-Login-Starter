import wrapper from 'utils/wrapper';
const { decrypt } = require('utils/encrypt');

/**
 * When the user clicks "forgot password?"
 * 
 * - Decodes the email from the url
 * - sets a cookie that, when the browser sees it, 
 * will serve the reset password form
 */

const handler = async (req, res) => {

  try {
    const { email } = req.query;

    /* decode and decrypt the email */
    const decoded = decodeURIComponent(email);
    const decryptedEmail = decrypt(decoded);

    /* set a cookie in the browser so it loads the reset password screen */
    res.cookie('authenticated'); // clears it
    res.cookie('reset_password', decryptedEmail);

    res.sendCookies();
    return res.redirect('/');
  }

  catch(e) {
    console.log('error ', e)
    return res.status(500).send(e.message);
  }
};

export default wrapper(handler);
