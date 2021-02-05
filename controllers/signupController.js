import db from 'lib/db';
const profanityFilter = require('helpers/profanityFilter');
const usernameFilter = require('helpers/usernameFilter');
const bcrypt = require('bcrypt');

const signupController = {};

let result, query;
/*************************************/

/**
 * Checks that email and username are formatted properly
 * - determines whether username is valid (no profanity, etc)
 * - note: Imports helper functions from the 'misc' folder
 */

signupController.validateEmailAndUsername = (req, res, next) => {

  const { email, username } = req.body;

  if (!email.includes('@') || !email.includes('.') ) {
    return { end: { error : 'this email is not properly formatted' } };
  };

  if (username.length > 20) {
    return { end: { error : 'username cannot be more than 20 characters' } };
  }

  const filterResult = usernameFilter(username);
  if (filterResult.status === false) {
    return { end: { error : filterResult.message } };
  };

  if (profanityFilter(username) === true) {
    return { end: { error : 'Profanity is not allowed in your username' } };
  };

  return {};
};

/*************************************/

signupController.validatePassword = (req, res, payload) => {
  
  const { password, confirmPassword } = payload;

  /* check if passwords match */
  if (password !== confirmPassword) {
    return { end: { error : 'passwords do not match' } };
  };

  /* check that password is proper length */
  if (password.length < 8) {
    return { end: { error : 'password must be more than 8 characters' } };
  };

  if (password.length > 20) {
    return { end: { error : 'password must be less than 20 characters' } };
  };

  return {};
};

/*************************************/

signupController.hashPassword = async (req, res, payload) => {

  const { password } = payload;

  /* hash the password using bcrypt */
  result = await bcrypt.hash(password, 8); 
  if (result.error) return { end: result.error };

  /* return the password */
  return { hashedPassword: result };
};

/*************************************/

signupController.createUser = async (req, res, payload) => {

  const { email, username, password } = payload;

  /* Create new user in database */
  query = `
    INSERT INTO users(email, username, password)
    VALUES("${email}", "${username}", "${password}")
  `;

  result = await db.query(query); 
  if (result.error) {
    /* Handle duplicate entry errors with an error message */
    if (result.error.code === 'ER_DUP_ENTRY') {
      return (result.error.sqlMessage.split('.')[1] === `username'`)
        ? { end: { error: 'This username is already registered.' } }
        : { end: { error: 'This email is already registered.' } }
    };
    console.log('error in createUser:', result.error);
    return { end: { error: 'an error occured' } };
  };

  return {};
};

/*************************************/

signupController.authenticateUser = async (req, res, payload) => {

  const { username } = payload;

  /* Set authentication status to true (0 -> 1) */
  query = `
    UPDATE users
    SET authenticated=1
    WHERE username="${username}"
  `;
  
  result = await db.query(query); 
  if (result.error) return { end: result.error };

  return {};
};

/*************************************/

signupController.getUserIdByUsername = async (req, res, payload) => {

  const { username } = payload;

  /* get the user_id from the username */
  query = `
    SELECT user_id
    FROM users
    WHERE username="${username}"
  `;
  
  result = await db.query(query); 
  if (result.error) return { end: result.error };

  const { user_id } = result[0];
  
  return { user_id }
};

/*************************************/

signupController.markDateCreated = async (req, res, payload) => {

  const { username } = payload;

  /* get the datetime */
  const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  /* update the "dateCreated" field with current datetime */
  query = `
    UPDATE users
    SET dateCreated = '${datetime}'
    WHERE username = '${username}'
  `;

  result = await db.query(query); 
  if (result.error) return { end: result.error };

  return {};
};

/*************************************/

signupController.deleteUser = async (req, res, payload) => {

  const { email } = payload;

  /* delete the user from database */
  query = `
    DELETE FROM users
    WHERE email = '${email}'
  `;

  result = await db.query(query); 
  if (result.error) return { end: result.error };

  return {};
};

/*************************************/

module.exports = signupController;