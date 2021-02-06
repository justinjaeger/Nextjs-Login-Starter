import { serialize } from 'cookie'

/**
 * This sets `cookie` on `res` object
 */

const cookie = (res, name, value, options = {}) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge)
    options.maxAge /= 1000
  }

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options))
};

const wrapper = handler => {

  return async (req, res) => {

    /* add res.locals for passing variables */
    res.locals = {};
    
    /* add cookie functionality */
    res.cookie = (name, value, options) => cookie(res, name, value, options)

    return handler(req, res);
  };
};

module.exports = wrapper;