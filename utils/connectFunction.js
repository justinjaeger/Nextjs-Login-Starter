import db from 'lib/db';

const fn = async (req, res, next) => {

    let query = `SELECT * FROM test WHERE letter='a'`;
    let result = await db.query(query);

    // handle errors
    res.handleErrors(result);
    res.handleEmptyResult(result);

    // handle success
    res.locals.data = result[0];
    return next();
};

export default fn;