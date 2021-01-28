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

  const { access_token } = req.body;

  const { method } = req; // POST, GET, etc...
  const action = req.query.slug[0];

  /* Get the user_id from the access_token, if exists */
  payload = { access_token }
  result = await tokenController.verifyToken(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json(result.end);
  };
  
  if (result.loggedIn === undefined) return res.json({ loggedIn: false });

  const { user_id } = result;

  console.log('should see user_id', user_id)

  /* Create data object to push other data to */
  const data = { user_id, loggedIn: true }

  switch (action) {
    case 'home':
      /* fetch username */
      query = `
        SELECT username FROM users WHERE user_id=${user_id}
      `;
      result = await db.query(query);
      if (result.end) {
        console.log('end: ', result.end)
        return res.json(result.end);
      };
      
      data.username = result[0].username;

      break;
    default:
      console.log('idk what you sent')
  };

  console.log('returning this data:', data)
  return res.json(data)
};
