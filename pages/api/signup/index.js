import loginController from 'controllers/loginController';
import emailController from 'controllers/emailController';
import signupController from 'controllers/signupController';

/**
 * When the user clicks 'Sign Up'
 */
 
let result, payload;
export default async function login(req, res) {

  const { email, username, password, confirmPassword } = req.body;

  /* Validate email and username */
  payload = { email, username };
  result = await signupController.validateEmailAndUsername(req, res, payload);
  if (result.end) return res.json(result.end);

  /* Validate password */
  payload = { password, confirmPassword };
  result = await signupController.validatePassword(req, res, payload);
  if (result.end) return res.json(result.end);

  /* Hash password */
  payload = { password };
  result = await signupController.hashPassword(req, res, payload);
  if (result.end) return res.json(result.end);

  const { hashedPassword } = result;

  console.log('hashed password', hashedPassword)

  /* Create user */
  payload = { email, username, password: hashedPassword };
  result = await signupController.createUser(req, res, payload);
  if (result.end) return res.json(result.end);

  /* Send Verification Email */
  payload = { email, username };
  result = await emailController.sendVerificationEmail(req, res, payload);
  if (result.end) return res.json(result.end);

  return res.json({
    message: `Please verify the email sent to ${email}.`
  });
};
