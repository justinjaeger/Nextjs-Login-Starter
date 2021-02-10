module.exports = function profanityFilter(username) {

  let output = false;

  const badWords = require('./profanityList')

  badWords.forEach(word => {
    if (username.includes(word) === true) {
      console.log('it has profanity')
      output = true;
    };
  });

  return output;
};