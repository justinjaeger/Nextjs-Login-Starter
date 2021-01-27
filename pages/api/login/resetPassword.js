import tokenController from 'controllers/tokenController';
import loginController from 'controllers/loginController';
import signupController from 'controllers/signupController';

/**
 * When the user clicks Reset Password
 */
 
let result, payload;
export default async function resetPassword(req, res) {

  const { email, password, confirmPassword } = req.body;

  /* Return User Data - use it to authenticate */
  payload = { entryType: 'email', emailOrUsername: email };
  result = await loginController.returnUserData(req, res, payload);
  if (result.end) return res.json(result.end);

  const { username, email, user_id } = result;

  /* Validate Password - signup */
  payload = { password, confirmPassword };
  result = await signupController.validatePassword(req, res, payload);
  if (result.end) return res.json(result.end);

  /* Hash Password - signup */
  payload = { password };
  result = await signupController.hashPassword(req, res, payload);
  if (result.end) return res.json(result.end);

  const { hashedPassword } = result;

  /* Update Password - login */
  payload = { hashedPassword, user_id };
  result = await loginController.updatePassword(req, res, payload);
  if (result.end) return res.json(result.end);

  /* Create Access Token */
  payload = { user_id };
  await tokenController.createAccessToken(req, res, payload);
  if (result.end) return res.json(result.end);

  /* Return data to client / log them in */ 
  return res.json({
    loggedIn: true,
    username: username,
    email: email,
  });
};
