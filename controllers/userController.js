import db from 'lib/db';

const userController = {};

let result, query;

/*************************************/

userController.getUsername = async (req, res, payload) => {

  const { user_id } = payload;

  query = `
    SELECT username 
    FROM users 
    WHERE user_id=${user_id}
  `;
  result = await db.query(query);
  if (result.error) return { end: result.error };

  const { username } = result[0];

  return { username };
};

/*************************************/

module.exports = userController;