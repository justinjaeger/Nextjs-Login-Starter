import fn from 'utils/testFunction';
import wrapper from 'utils/wrapper';

const handler = async (req, res) => {

  try {
    await fn(req, res);
    res.cookie('asshole', 'asshole')
    return res.send(res.locals.data);
  } 

  catch(e) {
    console.log('e',e)
    return res.status(500).send(e.message);
  }

  // return res.send(`Db returned ${result.data}`);

};

export default wrapper(handler);
