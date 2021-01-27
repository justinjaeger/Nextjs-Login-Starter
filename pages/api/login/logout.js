import tokenController from 'controllers/tokenController';

/**
 * When the user clicks 'Log Out'
 */
let result, payload;
export default async function logout(req, res) {

  /* Get the access_token string */
  const access_token = req.cookies.access_token;
  
  /* Delete access token */
  payload = { access_token };
  result = await tokenController.deleteAccessToken(req, res, payload);
  if (result.end) return res.json(result.end);

  return res.json({});
};
