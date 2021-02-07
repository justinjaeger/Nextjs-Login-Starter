import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
import signupController from 'controllers/signupController';

/**
 * When the user clicks 'Incorrect Email'
 */

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {

  res.locals.email = req.body;
  
  /* Delete User */
  await signupController.deleteUser(req, res, next);
})

// Return
handler.use((req, res) => {
  /* Clear Cookie */
  res.cookie('sent_verification');

  return res.json({
    message: `Account reset - please enter new email.`
  });
})

export default handler;
