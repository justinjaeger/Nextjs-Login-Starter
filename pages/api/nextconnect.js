import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
import fn from 'utils/connectFunction'

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {
  await fn(req, res, next);
  next();
})

// Return
handler.use((req, res) => {
  res.cookie('asshole', 'ass')  
  console.log('arra', res.cookieArray)
  res.sendCookies();

  console.log('returning this data:', res.data)
  return res.json(res.data);
})

export default handler;
