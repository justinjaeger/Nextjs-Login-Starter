import cookie from 'utils/cookies';

const handler = (req, res, next) => {

  res.cookieArray = [];

  res.cookie = (name, value, options) => cookie(res, name, value, options);

  res.sendCookies = () => res.setHeader('set-cookie', res.cookieArray);

  res.locals = {};
  res.data = {};
  res.next = false; 

  res.result = false;
  res.func = async (fn) => {
    let result = await fn(req, res, next);
    if (result) {
      return res.json(result)
    }
  }

  /* handles SQL errors, sends 500 status by default */
  res.handleErrors = result => {
    if (result.error) {
      console.log('error: ', result.error.message)
      return next(Error(result.error));
    };
  };

  /* 
    - if message, it sends data back for frontend to handle
    - if no message, it throws an error / 500 status
  */
  res.handleEmptyResult = (result, message) => {
    // first check if affected rows is less than one
    if (result.affectedRows) {
      if (result.affectedRows === 0) {
        return (message) 
        ? res.json(message) 
        : next(Error('Did not affect any rows in db'));
      };
    // not all queries hav affectedRows property... some queries return data
    // in that case, if no data is returned, flag it
    } else if (result[0] === undefined) {
      return (message) 
        ? res.json(message) 
        : next(Error('Did not return any data from db'));
    };
  };

  return next();
};

export default handler;
