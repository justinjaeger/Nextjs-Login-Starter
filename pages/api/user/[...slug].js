import tokenController from 'controllers/tokenController';
import verifyToken from 'middleware/verifyToken';

/**
 * Then if I want to fetch any data, I just do user / something
 * 
 * Below will be a switch case thing fetching different kinds of data
 * 
 * First, use the verify middleware to get the user_id for ANY case
 * Then, fetch the specific data you want based on the slug
 */

export default async function handler(req, res) {

  const { method } = req; // POST, GET, etc...
  const action = req.query.slug[0];

  /* Get the user_id from the access_token, if exists */
  const result = await verifyToken(req, res);
  if (result.loggedIn === false) res.json({ loggedIn: false });

  const { user_id } = result;

  /* Create data object to push other data to */
  const data = { user_id }

  switch (action) {
    case 'getUserData':
      console.log('get user data')
      // get some data
      // put it in the data object
      break;
    case 'getUserAss':
      // do something else
      console.log('get user ass')
      break;
    default:
      console.log('idk what you sent')
  };

  return res.json(data)
};
