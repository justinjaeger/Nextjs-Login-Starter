import db from 'lib/db';
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

const tokenController = {};

let query, result;

/*************************************/

tokenController.createAccessToken = async (req, res, payload) => {

  /* Deconstruct payload */
  const { user_id } = payload;

  /* Delete token if there is one */
  const cookies = new Cookies(req, res);
  cookies.set('access_token');

  /* CREATE ACCESS TOKEN */
  const accessPayload = { user_id };
  const accessOptions = { expiresIn: '10m'}; /* change the expiration here */
  const access_token = jwt.sign(accessPayload,  process.env.ACCESS_TOKEN_SECRET, accessOptions);
  
  /* SAVE TOKEN IN DB */
  query = `
    INSERT INTO tokens(access_token, user_id)
    VALUES("${access_token}", ${user_id})
  `;
  result = await db.query(query);
  if (result.error) return { end: result.error };

  /* SET COOKIE IN BROWSER */
  cookies.set('authenticated'); // deletes cookie if there is one
  cookies.set('reset_password');
  cookies.set('access_token', access_token, { httpOnly: true });
  
  return {};
};

/*************************************/

tokenController.deleteAccessToken = async (req, res, payload) => {

  const { access_token } = payload;

   /* Delete the access token in browser */
   const cookies = new Cookies(req, res);
   cookies.set('access_token');

  /* Delete the access token in db */
  const query = `
    DELETE FROM tokens
    WHERE access_token="${access_token}"
  `;
  result = await db.query(query);
  if (result.error) return { end: result.error };

  // if it affected no rows, that means a hacker already used the access token
  // therefore, we delete all user tokens
  if (result.affectedRows === 0) { 

    /* Delete All User Tokens */
    result = await tokenController.deleteAllUserTokens(req, res, { user_id });    
    if (result.end) return result; // fires if error in deleteAllUserTokens
    
    // we have to end here because we're not replenishing cookie
    return { end: 'deleted all user tokens'};
  };

  return {};
};

/*************************************/

tokenController.deleteAllUserTokens = async (req, res, payload) => {

  const { user_id } = payload;

  query = `
    DELETE FROM tokens
    WHERE user_id=${user_id}
  `;
  result = await db.query(query);
  if (result.error) return { end: result.error };
  
  return {};
};

/*************************************/

tokenController.verifyToken = async (req, res) => {

  /* Check that the access_token exists */
  if (req.cookies.access_token === undefined) return { end: { loggedIn: false } };

  /* Get the access_token string */
  const access_token = req.cookies.access_token;

  /* Get the expiration and user_id from the token */
  result = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true});
  if (result.error) return { end: result.error };
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

/*************************************/

export default tokenController;