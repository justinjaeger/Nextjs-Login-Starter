const jwt = require('jsonwebtoken');
import db from 'lib/db';

const tokenController = {};
let result, query;

/*************************************/

tokenController.verifyToken = async (req, res, next) => {

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
    // idk if this is necessary since it will replace it
    // res.cookie('access_token');
    console.log(res.cookieArray)

    /* DELETE ACCESS TOKEN FROM DB */
    result = await tokenController.deleteAccessToken(req, res, next);
    if (result.end) return;
    // next()

    console.log('refreshing token... ')
    /* and CREATE NEW ACCESS TOKEN */
    await tokenController.createAccessToken(req, res, next);
  };
};

/*************************************/

tokenController.createAccessToken = async (req, res, next) => {

  console.log('inside createAccessToken')

  const { user_id } = res.locals;

  /* Delete cookies in browser */
  // res.cookie('access_token');
  // res.cookie('authenticated');
  // res.cookie('reset_password');

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

  /* UPDATE LAST LOGGED IN */
  const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  query = `
    UPDATE users
    SET lastLoggedIn = '${datetime}'
    WHERE user_id = ${user_id} `;
  result = await db.query(query);
  res.handleErrors(result);
  res.handleEmptyResult(result);

  /* Set new cookie in browser */
  res.cookie('access_token', access_token, { httpOnly: true })

  res.locals.access_token = access_token;
};

/*************************************/

tokenController.deleteAccessToken = async (req, res, next) => {

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

    /* Delete cookie from browser */
    res.cookie('access_token');

    return {end: true};
  };

  return {};
};

/*************************************/

tokenController.getTokenData = async (req, res, next) => {

  console.log('inside getTokenData');

  const { access_token } = res.locals;

  /* Get the user_id from the JWT */
  result = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true});
  res.handleErrors(result);
  res.locals.user_id = result.user_id;
};

/*************************************/

export default tokenController;