import fn from 'utils/connectFunction';
import fn2 from 'utils/connectFunction2'

import nextConnect from 'next-connect';
import universalMid from 'utils/universalMid';
import cookies from 'next-cookies';

const handler = nextConnect();

// Universal Middleware
handler.use((req, res, next) => {
  universalMid(req, res, next);
});

// Functionality
handler.use(async (req, res, next) => {

  await fn(req, res, next);
  console.log('right after calling next')
  await fn2(req, res, next);

  next();
})

// Return
handler.use((req, res) => {
  console.log('sending back data')
  res.sendCookies();
  return res.json(res.locals.data)
})

export default handler;
