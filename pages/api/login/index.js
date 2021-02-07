import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
import tokenController from 'controllers/tokenController';
import loginController from 'controllers/loginController';

/**
 * When the user clicks Log In
 */

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {

  res.locals.emailOrUsername = req.body.emailOrUsername;
  res.locals.password = req.body.password;
  res.locals.entryType = (emailOrUsername.includes('@')) ? 'email' : 'username';
  /* ^^^ Determine entry type - email or username */

  /* Return User Data - use it to authenticate */
  await loginController.returnUserData(req, res, next);
})

// Return
handler.use((req, res) => {
  /* see loginController.returnUserData for the other data in res.locals we can send */
  return res.json({
    loggedIn: true,
    username: res.locals.username
  })
})

export default handler;
