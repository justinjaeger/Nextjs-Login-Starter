import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
import emailController from 'controllers/emailController';
import loginController from 'controllers/loginController';

/**
 * When the user submits "forgot password", which sends an email
 */

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {

  const { email } = req.body.email;
  res.locals.email = email;

  /* Check if email is valid */
  if (!email.includes('@') || !email.includes('.') ) {
    return res.json({ error : 'this email is not properly formatted' });
  };

  /* Check if email exists -- if no, don't send an email */
  await loginController.ifEmailNoExistDontSend(req, res, next);
  /* Send password reset email */
  await emailController.sendResetPasswordEmail(req, res, next);
})

// Return
handler.use((req, res) => {
  return res.json({ 
    message: `An email was sent to ${req.body.email}.`,
    route: '/blank',
  });
})

export default handler;
