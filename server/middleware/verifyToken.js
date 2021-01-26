const jwt = require('jsonwebtoken');

import tokenController from 'server/controllers/tokenController';

/**
 * Validates the access_token and returns { loggedIn: true, user_id }
 * 
 * If no token in cookies: returns {loggedIn: false}
 * 
 * If token is expired, it replenishes, so long as it finds the token in db
 *  - if it doesn't find it in db, all tokens associated with user are deleted
 */

let result;
export default async function verifyToken(req, res) {

  /* Check that the access_token exists */
  if (req.headers.cookie === undefined) return { loggedIn: false };
  if (!req.headers.cookie.includes('access_token')) return { loggedIn: false };

  /* Get the access_token string */
  const access_token = req.cookies.access_token;

  /* Get the expiration and user_id from the token */
  result = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true});
  const {user_id, exp: expiration } = result

  /* get the current time and check if token is expired */
  const currentTime = Math.ceil(Date.now()/1000);
  if (currentTime - expiration > 0) {

    /* If so, DELETE ACCESS TOKEN */
    result = await tokenController.deleteAccessToken(req, res, { access_token });
    if (result.end) return result;

    /* and CREATE NEW ACCESS TOKEN */
    await tokenController.createAccessToken(req, res, { user_id });
    if (result.end) return result;
      
  };

  /* Return user_id */ 
  return { loggedIn: true, user_id };
};
