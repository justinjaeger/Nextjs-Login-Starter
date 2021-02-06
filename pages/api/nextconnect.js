import nextConnect from 'next-connect';
import fn from 'utils/connectFunction';
import universalMid from 'utils/universalMid';


const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {
  await fn(req, res, next);
  res.cookie('fucfdk', 'asshole')
  next();
})

// Return
handler.use((req, res) => {
  return res.send(res.locals.data)
})

export default handler;
