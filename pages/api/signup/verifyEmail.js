import wrapper from 'utils/wrapper';
import signupController from 'controllers/signupController';
const { decrypt } = require('utils/encrypt');

/**
 * When the user clicks the link INSIDE EMAIL that verifies them
 * - sets a cookie that, when the browser sees it, 
 * redirects them to re-enter their password
 */

const handler = async (req, res) => {

  try {
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
    await signupController.authenticateUser(req, res);

    res.sendCookies();
    return res.redirect('/');
  } 

  catch(e) {
    console.log('error ', e);
    return res.status(500).send(e.message);
  }

};

export default wrapper(handler);
