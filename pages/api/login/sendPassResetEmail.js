import tokenController from 'controllers/tokenController';
import emailController from 'controllers/emailController';
import loginController from 'controllers/loginController';


/**
 * When the user submits "forgot password", which sends an email
 */
let result, payload;
export default async function sendPassResetEmail(req, res) {

  const { email } = req.body;

  /* Check if email exists -- if no, don't send an email */
  result = await loginController.ifEmailNoExistDontSend(req, res, { email });
  if (result.end) return res.json(result.end);

  /* Send password reset email */
  result = await emailController.sendResetPasswordEmail(req, res, { email });
  if (result.end) return res.json(result.end);

  /* Return a message and a route to client */
  return res.json({ 
    message: `An email was sent to ${req.body.email}. Didn't receive email? Make sure address is correct.`,
    route: '/blank',
  });
};
