import { serialize } from 'cookie'

/**
 * This sets `cookie` on `res` object
 */

const cookie = (res, name, value, options) => {

  if (!options) options = {};
  options.path = '/';

  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  if (!value) {
    options.expires = new Date(Date.now() - 1000);
  };

  // if no value, it deletes the cookie
  if (value) {
    res.cookieArray.push(serialize(name, String(stringValue), options))
  } else {
    res.cookieArray.push(serialize(name, '', options))
  };
}

export default cookie;