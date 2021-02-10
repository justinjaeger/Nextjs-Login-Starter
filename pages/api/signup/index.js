import wrapper from 'utils/wrapper';
import emailController from 'controllers/emailController';
import signupController from 'controllers/signupController';

/**
 * When the user clicks 'Sign Up'
 */

const handler = async (req, res) => {

  try {
    res.locals.email = req.body.email;
    res.locals.username = req.body.username;
    res.locals.password = req.body.password;
    res.locals.confirmPassword = req.body.confirmPassword;

    /* Validate email and username */  
    await signupController.validateEmailAndUsername(req, res);
    if (res.finished) return;
    /* Validate password */
    await signupController.validatePassword(req, res);
    if (res.finished) return;
    /* Hash password */
    await signupController.hashPassword(req, res);
    if (res.finished) return;
    /* Create user */
    await signupController.createUser(req, res);
    if (res.finished) return;
    /* Send Verification Email */
    await emailController.sendVerificationEmail(req, res);
    if (res.finished) return;
    /* Mark the DateCreated field */
    await signupController.markDateCreated(req, res);
    if (res.finished) return;

    /* set a cookie called sent_verification with value email */
    res.cookie('sent_verification', `${res.locals.username}*$%&${res.locals.email}`);

    res.sendCookies();
    return res.json({ 
      message: `Please verify the email sent to ${res.locals.email}.` 
    });
  }
  catch(e) {
    console.log('error ', e);
    return res.status(500).send(e.message);
  };
};

export default wrapper(handler);
