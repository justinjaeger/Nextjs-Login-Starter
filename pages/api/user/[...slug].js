import wrapper from 'utils/wrapper';
import tokenController from 'controllers/tokenController';
import userController from 'controllers/userController';

/**
 * Essentially gets called whenever we see that we have an access token
 * Needs to verify the access token, refreshing if neccessary,
 * and return the proper data (based on slug) back to the app
 */

import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';

// const handler = nextConnect();

// // Universal Middleware
// handler.use((req, res, next) => {
//   universalMid(req, res, next);
// });

// // Functionality
// handler.use(async (req, res, next) => {
//   res.locals.access_token = req.body.access_token;
//   res.data.loggedIn = false;
  
//   /* Verify the access_token */
//   await tokenController.verifyToken(req, res, next);

//   console.log('finished verifyToken')

//   /* Get the action from the slug */
//   const action = req.query.slug[0];

//   /* All the below functions fetch some user data using the user_id */

//   switch (action) {
//     case 'home':
//       /* Fetch the username */
//       await userController.getUsername(req, res, next);
//       res.data.username = res.locals.username;
//       res.data.loggedIn = true;
//       break;

//     default: /* Fetch something else */
//   };

//   next();
// })

// // Return
// handler.use((req, res) => {
//   res.cookie('asshole', 'ass')  
//   console.log('arra', res.cookieArray)
//   res.sendCookies();

//   console.log('returning this data:', res.data)
//   return res.json(res.data);
// })

// export default handler;







const handler = async (req, res) => {

  try {
    res.locals.access_token = req.body.access_token;
  
    /* Verify the access_token */
    await tokenController.verifyToken(req, res);
    
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

    res.cookie('assholes', 'ass')

    data.username = res.locals.username;
    data.cookieArray = res.cookieArray;

    res.sendCookies(); // purely for postman tests, cant actually handle cookies set on server
    
    console.log('ssending back this data:', data)
    return res.json(data)
  } 

  catch(e) {
    console.log('error in ...slug ', e.message);
    return res.status(500).send();
  }

};

export default wrapper(handler);
