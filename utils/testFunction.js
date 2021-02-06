import db from 'lib/db';


const fn = async (req, res) => {

  const result = await db.query(`SELECT * FROM test`);
  console.log('result',result)
  if (result.error) throw new Error('error selecting all from test');
  
  res.locals.data = result[0]
  return;
};

module.exports = fn;