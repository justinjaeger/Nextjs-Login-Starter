import emailController from 'controllers/emailController';

/**
 * sends another verification email
 */

let payload, result;

export default async function resendVerification(req, res) {

  const { email, username } = req.body;

  payload = { email, username };
  result = await emailController.sendVerificationEmail(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json(result.end);
  };

  return res.json({
    message: `Please verify the email sent to ${req.body.email}.`
    // SET AN OPTION TO DO A 'wrong email?' -- which will take you to the signup screen with username already filled out
  });
};
