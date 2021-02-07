import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
import tokenController from 'controllers/tokenController';
import loginController from 'controllers/loginController';
import signupController from 'controllers/signupController';

/**
 * When the user clicks Reset Password
 */

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {
  
  res.locals.password = req.body.password;
  res.locals.confirmPassword = req.body.confirmPassword;
  res.locals.emailOrUsername = req.body.email;
  res.locals.entryType = 'email';

  /* Return User Data - use it to authenticate */
  await loginController.returnUserData(req, res, next);
  /* Validate Password */
  await signupController.validatePassword(req, res, next);
  /* Hash Password */
  await signupController.hashPassword(req, res, next);
  /* Update Password */
  await loginController.updatePassword(req, res, next);
  /* Create Access Token */
  await tokenController.createAccessToken(req, res, next);
})

// Return
handler.use((req, res) => {
  return res.json({
    loggedIn: true,
    username: res.locals.username
  });
})

export default handler;
