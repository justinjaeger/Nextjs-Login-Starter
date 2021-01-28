import db from 'lib/db';
import tokenController from 'controllers/tokenController';

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

  /* get the access token */
  const { access_token } = req.body;
  console.log('access_token in users/main', access_token);

  /* Verify the access_token */
  payload = { access_token };
  result = await tokenController.verifyToken(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json(result); // keep this as result so it can send delete browser token signal
  };

  /* Deconstruct params - token params tell client to handle cookies */
  const { user_id, newToken, deletedToken } = result;
  
  /* Create data object to push other data to */
  const data = { user_id, loggedIn: true, newToken, deletedToken }

  /* Fetches the username */
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

  console.log('returning this data:', data)
  return res.json(data)
  
};

