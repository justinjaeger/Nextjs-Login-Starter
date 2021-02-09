const jwt = require('jsonwebtoken');
import db from 'lib/db';

const tokenController = {};
let result, query;

/*************************************/

tokenController.verifyToken = async (req, res) => {

  console.log('inside verifyToken');

  const { access_token } = res.locals;

  /* Get the expiration and user_id from the token */
  result = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true});
  res.handleErrors(result);
  const { user_id, exp: expiration } = result;
  res.locals.user_id = user_id;

  /* get the current time */
  const currentTime = Math.ceil(Date.now()/1000);

  /* if token is expired... */
  if (currentTime - expiration > 0) {
    console.log('TOKEN EXPIRED');

    /* Delete Access Token in browser */
    res.cookie('access_token');

    /* DELETE ACCESS TOKEN FROM DB */
    await tokenController.deleteAccessToken(req, res);

    /* and CREATE NEW ACCESS TOKEN */
    await tokenController.createAccessToken(req, res);

    /* Set new cookie in browser */
    res.cookie('access_token', result.access_token, { httpOnly: true })
  };
};

/*************************************/

tokenController.createAccessToken = async (req, res) => {

  console.log('inside createAccessToken')

  const { user_id } = res.locals;

  /* Delete cookies in browser */
  res.cookie('access_token');
  res.cookie('authenticated');
  res.cookie('reset_password');

  /* CREATE ACCESS TOKEN */
  const accessPayload = { user_id };
  const accessOptions = { expiresIn: '1s'}; /* change the expiration here */
  const access_token = jwt.sign(accessPayload,  process.env.ACCESS_TOKEN_SECRET, accessOptions);
  
  /* SAVE TOKEN IN DB */
  query = `
    INSERT INTO tokens(access_token, user_id)
    VALUES("${access_token}", ${user_id}) `;
  result = await db.query(query);
  res.handleErrors(result);
  res.handleEmptyResult(result);

  /* SET COOKIE IN BROWSER */
  res.cookie('access_token', access_token, { httpOnly: true });

  /* UPDATE LAST LOGGED IN */
  const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  query = `
    UPDATE users
    SET lastLoggedIn = '${datetime}'
    WHERE user_id = ${user_id} `;
  result = await db.query(query);
  res.handleErrors(result);
  res.handleEmptyResult(result);

  res.locals.access_token = access_token;
};

/*************************************/

tokenController.deleteAccessToken = async (req, res) => {

  console.log('inside deleteAccessToken')

  const { access_token, user_id } = res.locals;

  /* Delete the access token in db */
  query = `
    DELETE FROM tokens
    WHERE access_token="${access_token}" `;
  result = await db.query(query);
  res.handleErrors(result);

  console.log('token deleted')

  /* if it affected no rows, that means a hacker already used the access token. 
  Therefore, we delete all user tokens and end middleware chain. */
  if (result.affectedRows === 0) { 
    console.log('deleting all user tokens')
    /* Delete all tokens associated with user */
    query = `
    DELETE FROM tokens
    WHERE user_id=${user_id}`;
    result = await db.query(query);
    res.handleErrors(result);

    console.log('cookie array: ', res.cookieArray)
    throw new Error(res);
  };
};

/*************************************/

tokenController.getTokenData = async (req, res) => {

  console.log('inside getTokenData');

  const { access_token } = res.locals;

  /* Get the user_id from the JWT */
  result = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true});
  res.handleErrors(result);
  res.locals.user_id = result.user_id;
};

/*************************************/

export default tokenController;