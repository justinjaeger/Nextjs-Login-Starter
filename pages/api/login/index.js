import tokenController from 'controllers/tokenController';
import loginController from 'controllers/loginController';

/**
 * When the user clicks 'Log In'
 */
 
let result, payload;

export default async function login(req, res) {

  const { emailOrUsername, password } = req.body;

  /* Determine entrytype - email or username */
  const entryType = (emailOrUsername.includes('@')) ? 'email' : 'username';

  /* Return User Data - use it to authenticate */
  payload = { entryType, emailOrUsername };
  result = await loginController.returnUserData(req, res, payload);
  if (result.end) return res.json(result.end);
  
  const { username, email, user_id, dbPassword, authenticated } = result;

  /* Verify Password */
  payload = { password, dbPassword };
  result = await loginController.verifyPassword(req, res, payload);
  if (result.end) return res.json(result.end);

  /* Verify Email Authentication */
  if (authenticated === 0) return res.json({
      message: `Please verify the email sent to ${email}.`,
      email: email,
      username: username,
  });

  /* Create Access Token */
  payload = { user_id };
  result = await tokenController.createAccessToken(req, res, payload);
  if (result.end) return res.json(result.end);

  /* Return data to client */ 
  return res.json({
    loggedIn: true,
    username: username,
  });
};
