import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
import emailController from 'controllers/emailController';
import signupController from 'controllers/signupController';

/**
 * When the user clicks 'Sign Up'
 */

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {

  res.locals.email = req.body.email;
  res.locals.username = req.body.username;
  res.locals.password = req.body.password;
  res.locals.confirmPassword = req.body.confirmPassword;

  /* Validate email and username */
  await signupController.validateEmailAndUsername(req, res, next);
  /* Validate password */
  await signupController.validatePassword(req, res, next);
  /* Hash password */
  await signupController.hashPassword(req, res, next);
  /* Create user */
  await signupController.createUser(req, res, next);
  /* Send Verification Email */
  await emailController.sendVerificationEmail(req, res, next);
  /* Mark the DateCreated field */
  await signupController.markDateCreated(req, res, next);
})

// Return
handler.use((req, res) => {

  /* set a cookie called sent_verification with value email */
  res.cookie('sent_verification', `${res.locals.username}*$%&${res.locals.email}`);

  return res.json({
    message: `Please verify the email sent to ${res.locals.email}.`
  });
})

export default handler;
