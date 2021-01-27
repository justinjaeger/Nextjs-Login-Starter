import db from 'lib/db';
const bcrypt = require('bcrypt');

const loginController = {};

let query, result;

/*************************************/

loginController.verifyPassword = async (req, res, payload) => {

  const { password, dbPassword } = payload;

  /* Verify password with bcrypt */
  result = await bcrypt.compare(password, dbPassword);
  if (result.error) return { end: result.error };

  /* If it returns false, send error back */
  if (result === false) {
    return { end: { error: `Credentials do not match` } };
  };

  return {};

};

/*************************************/

loginController.returnUserData = async (req, res, payload) => {

  const { entryType, emailOrUsername } = payload;

  /* Fetch email or username based on entry */
  query = `
    SELECT *
    FROM users
    WHERE ${entryType}="${emailOrUsername}"
  `;
  result = await db.query(query);
  if (result.error) return { end: result.error };

  /* If no data came back, credentials were invalid */
  if (result[0] === undefined) {
    return { end: { error: `Credentials do not match` } };
  };

  /* Deconstruct all the data we just got */
  const { username, email, user_id,  password: dbPassword } = result[0];
  const authenticated = result[0].authenticated[0]

  /* Return the data */
  return { username, email, user_id, dbPassword, authenticated };
};

/*************************************/

/**
 * Attempts to get the user_id 
 * - if it returns nothing, it doesn't exist
 *   - because we dont want someone to be able to figure out whose email is valid and whose isn't, we send back a message saying we sent the email even if we didn't
 * - if it returns a user_id, we proceed to next middleware
 */

loginController.ifEmailNoExistDontSend = async (req, res, payload) => {
  
  const { email } = payload;

  /* Fetch email or username based on entry */
  query = `
    SELECT user_id 
    FROM users
    WHERE email="${email}"
  `;
  result = await db.query(query);
  if (result.error) return { end: result.error };

  if (result[0] === undefined) {
    /* if no result, it means the user doesn't exist
      But we should send the message anyway in case a hacker
      is fishing for valid emails */
    return { end: { 
      message: `An email was sent to ${req.body.email}. Didn't receive email? Make sure address is correct.`,
      route: '/blank',
    }};
  };

  /* If we are here, it means the user was found and we continue */
  return {};
};

/*************************************/

loginController.updatePassword = async (req, res, payload) => {

  const { hashedPassword, user_id } = payload;

  /* Update the password in db */
  query = `
    UPDATE users
    SET password=${hashedPassword}
    WHERE user_id=${user_id}
  `;
  result = await db.query(query);
  if (result.error) return { end: result.error };

  /* Check that it actually updated */
  if (result.affectedRows === 0) {
    return { end: 'update password unsuccessful' };
  };
  
  return {};
};

/*************************************/

export default loginController;