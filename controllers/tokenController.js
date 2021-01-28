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
  
  /* if token is expired... */
  if (currentTime - expiration > 0) {

    console.log('TOKEN EXPIRED');

    /* DELETE ACCESS TOKEN */
    payload = { access_token, user_id };
    result = await tokenController.deleteAccessToken(req, res, payload);
    if (result.end) return result;

    /* and CREATE NEW ACCESS TOKEN */
    payload = { user_id };
    await tokenController.createAccessToken(req, res, payload);
    if (result.end) return result;
      
  };

  /* Return user_id */ 
  return { user_id };
};

/*************************************/

tokenController.createAccessToken = async (req, res, payload) => {

  console.log('inside createAccessToken')

  /* Deconstruct payload */
  const { user_id } = payload;

  /* Delete the access token in browser */
  const cookies = new Cookies(req, res);
  cookies.set('access_token');

  /* CREATE ACCESS TOKEN */
  const accessPayload = { user_id };
  const accessOptions = { expiresIn: '10s'}; /* change the expiration here */
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
  cookies.set('access_token');
  cookies.set('access_token', access_token);

  console.log('should have just set a new cookie in browser')
  
  return {};
};

/*************************************/

tokenController.deleteAccessToken = async (req, res, payload) => {

  console.log('inside deleteAccessToken')

  const { access_token, user_id } = payload;

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

  console.log('just deleted access token in db and browser supposedly', result)

  /* if it affected no rows, that means a hacker already used
  the access token. therefore, we delete all user tokens */
  if (result.affectedRows === 0) { 

    console.log('affected no rows, so gonna delete all user tokens')

    /* Delete All User Tokens */
    result = await tokenController.deleteAllUserTokens(req, res, { user_id });    
    if (result.end) return result; // fires if error in deleteAllUserTokens
    
    /* we have to end here because we're not replenishing the cookie */
    return { end: 'deleted all user tokens'};
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

  console.log('everything went fine, deleted wheree user_id=')
  
  return {};
};

/*************************************/

export default tokenController;