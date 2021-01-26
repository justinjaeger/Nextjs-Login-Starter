import tokenController from 'controllers/tokenController';

/**
 * Then if I want to fetch any data, I just do users / something
 * 
 * Below will be a switch case thing fetching different kinds of data
 * 
 * First, use the verify middleware to get the user_id for ANY case
 * Then, fetch the specific data you want based on the slug
 */

export default async function handler(req, res) {
  const {
    query: { action },
  } = req

  if (req.method === 'POST' && action === 'login') {
    // DO Something
  }
};
