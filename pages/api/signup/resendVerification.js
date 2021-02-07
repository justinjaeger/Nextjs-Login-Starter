import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
import emailController from 'controllers/emailController';

/**
 * When user clicks "resend verification email"
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

  /* Send verification email */
  await emailController.sendVerificationEmail(req, res, next);
})

// Return
handler.use((req, res) => {
  return res.json({
    message: `Please verify the email sent to ${res.locals.email}.`
  });
})

export default handler;
