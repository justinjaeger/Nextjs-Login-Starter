import cookie from 'utils/connectWrapper';

const handler = (req, res, next) => {

  res.locals = {};

  /* handles SQL errors, sends 500 status by default */
  res.handleErrors = result => {
    if (result.error) {
      console.log('error: ', result.error.message)
      return next(Error(result.error));
    };
  };

  /* 
    - if message, it sends a data back for frontend to handle
    - if no message, it throws an error / 500 status
  */
  res.handleEmptyResult = (result, message) => {
    if (!result[0]) {
      return (message) 
        ? res.json(message) 
        : next(Error('Did not affect any rows in db'));
    };
  };

  res.cookie = (name, value, options) => cookie(res, name, value, options);

  return next();
};

export default handler;
