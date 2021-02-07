import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
import tokenController from 'controllers/tokenController';

/**
 * When the user clicks Log Out
 */

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {

  res.locals.access_token = req.cookies.access_token;

  /* Get user_id from token */
  await tokenController.getTokenData(req, res, next);
  /* Delete access token on client and db */
  await tokenController.deleteAccessToken(req, res, next);
})

// Return
handler.use((req, res) => {
  return res.json({})
})

export default handler;
