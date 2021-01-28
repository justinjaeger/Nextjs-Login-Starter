import tokenController from 'controllers/tokenController';
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

/**
 * When the user clicks 'Log Out'
 */
let result, payload;
export default async function logout(req, res) {

  /* Get the access_token */
  const access_token = req.cookies.access_token;

  /* Get the user_id from the token */
  result = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true});
  if (result.error) return res.json(result.error);
  const { user_id } = result
  
  /* Delete access token */
  payload = { access_token, user_id };
  result = await tokenController.deleteAccessToken(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json(result.end);
  };

  return res.json({});
};
