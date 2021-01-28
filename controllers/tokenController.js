const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

import db from 'lib/db';

const tokenController = {};

let query, result;


/*************************************/

tokenController.verifyToken = async (req, res, payload) => {

  const { access_token } = payload;

  /* Get the expiration and user_id from the token */
  result = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true});
  if (result.error) return { end: result.error };
  const { user_id, exp: expiration } = result

  /* get the current time */
  const currentTime = Math.ceil(Date.now()/1000);

  let newToken, deletedToken;
  
  /* if token is expired... */
  if (currentTime - expiration > 0) {

    console.log('TOKEN EXPIRED');

    /* when serverSideProps receives this as true, it deletes cookie on browser */
    deletedToken = true;

    /* DELETE ACCESS TOKEN FROM DB */
    payload = { access_token, user_id };
    result = await tokenController.deleteAccessToken(req, res, payload);
    if (result.end) return result;

    /* and CREATE NEW ACCESS TOKEN */
    payload = { user_id };
    result = await tokenController.createAccessToken(req, res, payload);
    if (result.end) return result;
    /* when serverSideProps receives this, it creates a cookie on browser*/
    newToken = result.access_token;
  };

  /* Return user_id */ 
  return { user_id, newToken, deletedToken };
};

/*************************************/

tokenController.createAccessToken = async (req, res, payload) => {

  console.log('inside createAccessToken')

  /* Deconstruct payload */
  const { user_id } = payload;

  /* Delete cookies in browser */
  const cookies = new Cookies(req, res);
  cookies.set('access_token');
  cookies.set('authenticated');
  cookies.set('reset_password');

  /* CREATE ACCESS TOKEN */
  const accessPayload = { user_id };
  const accessOptions = { expiresIn: '5s'}; /* change the expiration here */
  const access_token = jwt.sign(accessPayload,  process.env.ACCESS_TOKEN_SECRET, accessOptions);
  
  /* SAVE TOKEN IN DB */
  query = `
    INSERT INTO tokens(access_token, user_id)
    VALUES("${access_token}", ${user_id})
  `;
  result = await db.query(query);
  if (result.error) return { end: result.error };

  /* SET COOKIE IN BROWSER */
  cookies.set('access_token', access_token, { httpOnly: true });

  console.log('should have just set a new cookie in browser')
  
  return { access_token };
};

/*************************************/

tokenController.deleteAccessToken = async (req, res, payload) => {

  console.log('inside deleteAccessToken')

  /* Clear browser token */
  const cookies = new Cookies(req, res);
  cookies.set('access_token');

  const { access_token, user_id } = payload;

  /* Delete the access token in db */
  const query = `
    DELETE FROM tokens
    WHERE access_token="${access_token}"
  `;
  result = await db.query(query);
  if (result.error) return { end: result.error };

  console.log('just deleted access token in db and browser supposedly')

  /* if it affected no rows, that means a hacker already used
  the access token. therefore, we delete all user tokens */
  if (result.affectedRows === 0) { 

    console.log('affected no rows, so gonna delete all user tokens')

    /* Delete All User Tokens */
    result = await tokenController.deleteAllUserTokens(req, res, { user_id });    
    if (result.end) return result; // fires if error in deleteAllUserTokens
    
    /* we have to end here because we're not replenishing the cookie */
    return { end: 'deleted all user tokens', deleteToken: true };
  };

  return {};
};

/*************************************/

tokenController.deleteAllUserTokens = async (req, res, payload) => {

  console.log('inside deleteAllUserTokens')

  const { user_id } = payload;

  query = `
    DELETE FROM tokens
    WHERE user_id=${user_id}
  `;
  result = await db.query(query);
  if (result.error) return { end: result.error };

  console.log('deleted all user tokenss')
  
  return {};
};

/*************************************/

export default tokenController;