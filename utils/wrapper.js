import cookie from 'utils/cookies';

const wrapper = handler => {

  return async (req, res) => {

    /* add a "next" function */
    // res.next = (arg) => {
    //   if(bool === true)
    // };

    /* add res.locals for passing variables */
    res.locals = {};
    
    /* add cookie functionality */
    res.cookieArray = [];
    res.cookie = (name, value, options) => cookie(res, name, value, options)
    res.sendCookies = () => res.setHeader('set-cookie', res.cookieArray);

    /* add default error handling */
    res.handleErrors = result => {
      if (result.error) {
        console.log('throwing error in res.handleErrors')
        throw new Error(result.error);
      };
    };
  
    /* handle empty results from queries
      - if message, it sends a data back for frontend to handle
      - if no message, it throws an error / 500 status
    */
    res.handleEmptyResult = (result, message) => {
      // sometimes the response has an affectedRows property
      if (result.affectedRows) {
        // if it does, check if it's zero. if so, send error
        if (result.affectedRows === 0) {
          if (message) res.json(message) 
          else throw new Error('Did not affect any rows in db');
        };
      // not all queries hav affectedRows property... some queries return data
      // in that case, if no data is returned, flag it
      } else if (result[0] === undefined) {
        if (message) res.json(message) 
        else throw new Error('Did not return any data');
      };
    };
    
    return handler(req, res);
  };
};

module.exports = wrapper;