import tokenController from 'controllers/tokenController';
import emailController from 'controllers/emailController';
import loginController from 'controllers/loginController';


/**
 * When the user submits "forgot password", which sends an email
 */
let result, payload;
export default async function sendPassResetEmail(req, res) {

  const { email } = req.body;

  /* Check if email is valid */
  if (!email.includes('@') || !email.includes('.') ) {
    return res.json({ error : 'this email is not properly formatted' });
  };

  /* Check if email exists -- if no, don't send an email */
  result = await loginController.ifEmailNoExistDontSend(req, res, { email });
  if (result.end) {
    console.log('end: ', result.end)
    return res.json(result.end);
  };

  /* Send password reset email */
  result = await emailController.sendResetPasswordEmail(req, res, { email });
  if (result.end) {
    console.log('end: ', result.end)
    return res.json(result.end);
  };

  /* Return a message and a route to client */
  return res.json({ 
    message: `An email was sent to ${req.body.email}.`,
    // SET A ROUTE TO SEND GO BACK AND SEND THE EMAIL AGAIN IF IT'S WRONG 'enter email again'
    route: '/blank',
  });
};
