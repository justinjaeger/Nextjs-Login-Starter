import db from 'lib/db';

export default async function test(req, res) {

    const user_id = 108;
    const query = `
      SELECT username
      FROM users
      WHERE user_id=${user_id}
    `;
    
    const result = await db.query(query);

    return (result.error) 
      ? res.send(result.error)
      : (result.length > 0)
          ? res.json({ username: result[0].username })
          : res.json({})
};
