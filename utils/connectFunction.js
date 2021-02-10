import db from 'lib/db';
import { join } from './profanityList';

const fn = async (req, res, next) => {

  console.log('inside fn')

  let query = `SELECT * FROM test`;
  let result = await db.query(query);
  
  if (result) return next();
  console.log('should not see this')

  // handle SQL errors
  // handle empty result arrays OR "no rows affected"
  res.handleErrors(result);
  res.handleEmptyResult(result);

  // handle success
  res.locals.data = result[0];
};

export default fn;