const Cookies = require('cookies');

/*************************************/

export default function cookie(req, res) {


  console.log('inside cookie')

  const { key, value, method } = req.body;
  // const key = 'key';
  // const value = 'value';
  // const method = 'delete';

  const cookies = new Cookies(req, res);

  switch (method) {
    /* Creates a new cookie */
    case 'create':
      cookies.set(key, value, { httpOnly: true });
      break;

    case 'delete':
      cookies.set(key);
      break;
  };

  return res.json({});
};
