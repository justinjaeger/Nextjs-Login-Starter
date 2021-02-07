import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
import tokenController from 'controllers/tokenController';
import userController from 'controllers/userController';

/**
 * Essentially gets called whenever we see that we have an access token
 * Needs to verify the access token, refreshing if neccessary,
 * and return the proper data (based on slug) back to the app
 */

const handler = nextConnect();

 // Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {
  res.locals.access_token = req.body.access_token;
  /* Verify the access_token */
  await tokenController.verifyToken(req, res, next);
})

// Switchboard
handler.use(async (req, res, next) => {

  /* Get the action from the slug */
  const action = req.query.slug[0];

  /* Create data object to push other data to */
  const data = { 
    user_id: res.locals.user_id, 
    loggedIn: true 
  };

  /* All the below functions fetch some user data using the user_id */

  switch (action) {
    case 'something': /* Fetch something */
      // do something
      break;

    default: /* Fetch the username */
      result = await userController.getUsername(req, res, { user_id });
      if (result.end) {
        console.log('end: ', result.end)
        return res.json({ error: result.end });
      };
      data.username = result.username;
  };
});

// Return
handler.use((req, res) => {
  console.log('returning this data:', data)
  return res.json(data)
})

export default handler;





let query, result, payload;

export default async function handler(req, res) {

  /* Get the action from the slug */
  const action = req.query.slug[0];

  /* Get the access token */
  const { access_token } = req.body;

  /* Verify the access_token */
  payload = { access_token };
  result = await tokenController.verifyToken(req, res, payload);
  if (result.end) {
    console.log('end: ', result.end)
    return res.json(result); // keep this as result so it can send delete browser token signal
  };

  /* Deconstruct result - token params tell client to handle cookies */
  const { user_id, newToken, deletedToken } = result;
  
  /* Create data object to push other data to */
  const data = { user_id, newToken, deletedToken, loggedIn: true }

  /****** SWITCHBOARD ******/
  /* All the below functions fetch some user data using the user_id */

  switch (action) {
    case 'something': /* Fetch something */
      // do something
      break;

    default: /* Fetch the username */
      result = await userController.getUsername(req, res, { user_id });
      if (result.end) {
        console.log('end: ', result.end)
        return res.json({ error: result.end });
      };
      data.username = result.username;
  };

  console.log('returning this data:', data)
  return res.json(data)
}
