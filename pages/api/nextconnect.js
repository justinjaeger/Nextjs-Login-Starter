import fn from 'utils/connectFunction';

import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {
  await fn(req, res, next);
})

// Return
handler.use((req, res) => {
  return res.json(res.locals.data)
})

export default handler;
