const Cookies = require('cookies');
const { encrypt, decrypt } = require('helpers/encrypt');

import emailController from 'controllers/emailController';

/**
 * sends another verification email
 */

export default async function resendVerification(req, res) {

  const { email, username } = req.body;

  payload = { email, username };
  result = await emailController.sendVerificationEmail(req, res, payload);
  if (result.end) return res.json(result.end);

  return res.json({
    message: `Please verify the email sent to ${req.body.email}.`
  });
};
