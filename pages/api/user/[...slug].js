import db from 'lib/db';
import tokenController from 'controllers/tokenController';
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');
import axios from 'axios';

// const Cookies = require('js-cookie');

// var cookie = require('cookie');

/**
 * Then if I want to fetch any data, I just do user / something
 * 
 * Below will be a switch case thing fetching different kinds of data
 * 
 * First, use the verify middleware to get the user_id for ANY case
 * Then, fetch the specific data you want based on the slug
 */

let query, result, payload;

export default async function handler(req, res) {

  /* MAKE A COOKIE */
  payload = { key: 'key', value: 'value', method: 'create' };
  result = await axios.get(`${process.env.DEV_ROUTE}/api/cookies`, payload)
  console.log('result', result.data)

  const { access_token } = req.body;
  console.log('access_token in users/main', access_token)
  
  const action = req.query.slug[0];

  /* Verify the access_token */
  payload = { access_token };
  result = await tokenController.verifyToken(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json(result.end);
  };
  
  /* Get the user_id from above middleware */
  const { user_id } = result;

  /* Create data object to push other data to */
  const data = { user_id, loggedIn: true }

  /* All the below functions fetch some user data with the user_id */
  switch (action) {

    /* Fetches the username */
    case 'main':
      query = `
        SELECT username 
        FROM users 
        WHERE user_id=${user_id}
      `;
      result = await db.query(query);
      if (result.end) {
        console.log('end main: ', result.end)
        return res.json(result.end);
      };
      data.username = result[0].username;
      break;
  };

  console.log('returning this data:', data)
  return res.json(data)
  
};

