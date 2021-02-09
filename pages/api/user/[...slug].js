import wrapper from 'utils/wrapper';
import tokenController from 'controllers/tokenController';
import userController from 'controllers/userController';

/**
 * Essentially gets called whenever we see that we have an access token
 * Needs to verify the access token, refreshing if neccessary,
 * and return the proper data (based on slug) back to the app
 */

const handler = async (req, res) => {

  try {
    res.locals.access_token = req.body.access_token;
  
    /* Verify the access_token */
    await tokenController.verifyToken(req, res);

    console.log('finished verifyToken')

    /* Get the action from the slug */
    const action = req.query.slug[0];

    /* Create data object to push other data to */
    const data = { 
      user_id: res.locals.user_id, 
      loggedIn: true 
    };

    /* All the below functions fetch some user data using the user_id */

    switch (action) {
      case 'home':
        /* Fetch the username */
        await userController.getUsername(req, res);
        break;

      default: /* Fetch something else */
    };

    data.username = res.locals.username;
    console.log('returning this data:', data)
    
    console.log('cookie array: ', res.cookieArray)
    res.sendCookies();
    return res.json(data)
  } 

  catch(e) {
    console.log('error in ...slug ', e.message);
    return res.status(500).send();
  }

};

export default wrapper(handler);
