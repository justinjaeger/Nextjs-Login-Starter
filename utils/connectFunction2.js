import db from 'lib/db';

const fn = async (req, res, next) => {

  console.log('inside fn2 (should not see)')

  let query = `SELECsT * FROM test`;
  let result = await db.query(query);
  // console.log(result)

  res.cookie('new_token', 'newtoken');

};

export default fn;