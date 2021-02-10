import wrapper from 'utils/wrapper';

const handler = async (req, res) => {

  try {

    res.sendCookies();
    return res.json({})
  } 
  catch(e) {
    console.log('error ', e);
    return res.status(500).send(e.message);
  };

};

export default wrapper(handler);