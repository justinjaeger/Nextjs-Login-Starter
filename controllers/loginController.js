import db from 'lib/db';
const bcrypt = require('bcrypt');

const loginController = {};
let query, result;

/*************************************/

loginController.verifyPassword = async (req, res, next) => {

  const { password, dbPassword } = res.locals;

  /* Verify password with bcrypt */
  result = await bcrypt.compare(password, dbPassword);
  res.handleErrors(result);
  /* If it returns false, set error on client */
  if (result === false) {
    return res.json({ error: `Credentials do not match` });
  };

  return next();
};

/*************************************/

loginController.returnUserData = async (req, res, next) => {

  const { entryType, emailOrUsername } = res.locals;

  /* Fetch email or username based on entry */
  query = `
    SELECT *
    FROM users
    WHERE ${entryType}="${emailOrUsername}" `;
  result = await db.query(query);
  res.handleErrors(result);
  res.handleEmptyResult(result, { error: `Credentials do not match` });

  /* Deconstruct all the data we just got */
  const { username, email, user_id,  password: dbPassword } = result[0];
  const authenticated = result[0].authenticated[0];

  res.locals.username = username;
  res.locals.email = email;
  res.locals.user_id = user_id;
  res.locals.dbPassword = dbPassword;
  res.locals.authenticated = authenticated;

  /* Return the data */
  return next();
};

/*************************************/

/**
 * Attempts to get the user_id 
 * - if it returns nothing, it doesn't exist
 *   - because we dont want someone to be able to figure out whose email is valid and whose isn't, we send back a message saying we sent the email even if we didn't
 * - if it returns a user_id, we proceed to next middleware
 */

loginController.ifEmailNoExistDontSend = async (req, res, next) => {
  
  const { email } = res.locals;

  /* Fetch user_id. If no result, user doesn't exist */
  query = `
    SELECT user_id 
    FROM users
    WHERE email="${email}" `;
  result = await db.query(query);
  res.handleErrors(result);
  /* If user no exist, We should send the message anyway 
  in case a hacker is fishing for valid emails */
  res.handleEmptyResult(result, { 
    message: `An email was sent to ${req.body.email}.`,
    route: '/blank',
  });

  /* If we are here, it means the user was found and we continue */
  return next();
};

/*************************************/

loginController.updatePassword = async (req, res, next) => {

  const { hashedPassword, user_id } = res.locals;

  /* Update the password in db */
  query = `
    UPDATE users
    SET password="${hashedPassword}"
    WHERE user_id=${user_id} `;
  result = await db.query(query);
  res.handleErrors(result);
  res.handleEmptyResult(result);

  return next();
};

/*************************************/

export default loginController;