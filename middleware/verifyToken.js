const jwt = require('jsonwebtoken');

import tokenController from 'controllers/tokenController';

/**
 * Validates the access_token and returns { loggedIn: true, user_id }
 * 
 * If no token in cookies: returns { loggedIn: false }
 * 
 * If token is expired, it replenishes, so long as it finds the token in db
 *  - if it doesn't find it in db, all tokens associated with user are deleted
 */

let result, payload;
export default async function verifyToken(req, res) {

  /* Check that the access_token exists */
  if (req.cookies.access_token === undefined) return res.json({ loggedIn: false });

  /* Get the access_token string */
  const access_token = req.cookies.access_token;

  /* Get the expiration and user_id from the token */
  result = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true});
  const { user_id, exp: expiration } = result

  /* get the current time */
  const currentTime = Math.ceil(Date.now()/1000);
  
  /* if token is expired... */
  if (currentTime - expiration > 0) {

    /* DELETE ACCESS TOKEN */
    payload = { access_token };
    result = await tokenController.deleteAccessToken(req, res, payload);
    if (result.end) return result;

    /* and CREATE NEW ACCESS TOKEN */
    payload = { user_id };
    await tokenController.createAccessToken(req, res, payload);
    if (result.end) return result;
      
  };

  /* Return user_id */ 
  return { loggedIn: true, user_id };
};
