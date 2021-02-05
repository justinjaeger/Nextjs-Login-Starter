import signupController from 'controllers/signupController';
const Cookies = require('cookies');

/**
 * When the user clicks 'Incorrect Email'
 */

let result, payload;

export default async function login(req, res) {

  const { email } = req.body;
  
  /* Delete User */
  payload = { email };
  result = await signupController.deleteUser(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json(result.end);
  };

  /* Clear Cookie */
  const cookies = new Cookies(req, res);
  cookies.set('sent_verification');

  return res.json({
    message: `Account reset - please enter new email.`
  });
};
