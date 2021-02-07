import db from 'lib/db';

const fn = async (req, res, next) => {

  console.log('inside fn')

  let query = `SELECT * FROM test`;
  let result = await db.query(query);

  console.log('result', result)
  // handle SQL errors
  // handle empty result arrays OR "no rows affected"
  res.handleErrors(result);
  res.handleEmptyResult(result);

  // handle success
  res.locals.data = result[0];
  next();
};

export default fn;