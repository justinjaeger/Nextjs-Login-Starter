import db from 'lib/db';

const userController = {};
let result, query;

/*************************************/

userController.getUsername = async (req, res) => {

  const { user_id } = res.locals;

  query = `
    SELECT username 
    FROM users 
    WHERE user_id=${user_id} `;
  result = await db.query(query);
  res.handleErrors(result);
  res.handleEmptyResult(result);

  res.locals.username = result[0].username;
};

/*************************************/

module.exports = userController;