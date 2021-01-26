import db from 'lib/db';
const bcrypt = require('bcrypt');

const tokenController = {};

let query, result;

/*************************************/

tokenController.verifyPassword = async (req, res, payload) => {

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

tokenController.returnUserData = async (req, res, payload) => {

  const { entryType, emailOrUsername } = payload;

  /* Fetch email or username based on entry */
  query = `
    SELECT *
    FROM users
    WHERE ${entryType}="${emailOrUsername}"
  `;
  result = await db.query(query);
  if (result.error) return res.end(result.error);

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


export default tokenController;