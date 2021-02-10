import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {
  next();
});

// Return
handler.use((req, res) => {
  res.sendCookies();
  return res.json(res.data);
});

export default handler;
