import loginController from 'controllers/loginController';
import emailController from 'controllers/emailController';
import signupController from 'controllers/signupController';
const Cookies = require('cookies');

/**
 * When the user clicks 'Sign Up'
 */

let result, payload;

export default async function login(req, res) {

  const { email, username, password, confirmPassword } = req.body;

  /* Validate email and username */
  payload = { email, username };
  result = await signupController.validateEmailAndUsername(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json({ error: result.end });
  };

  /* Validate password */
  payload = { password, confirmPassword };
  result = await signupController.validatePassword(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json({ error: result.end });
  };

  /* Hash password */
  payload = { password };
  result = await signupController.hashPassword(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json({ error: result.end });
  };

  const { hashedPassword } = result;

  /* Create user */
  payload = { email, username, password: hashedPassword };
  result = await signupController.createUser(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json({ error: result.end });
  };

  /* Send Verification Email */
  payload = { email, username };
  result = await emailController.sendVerificationEmail(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json({ error: result.end });
  };

  /* Mark the DateCreated field */
  payload = { username };
  result = await signupController.markDateCreated(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json({ error: result.end });
  };

  /* set a cookie called sent_verification with value email */
  const cookies = new Cookies(req, res);
  cookies.set('sent_verification', `${username}*$%&${email}`);

  return res.json({
    message: `Please verify the email sent to ${email}.`
  });
};
