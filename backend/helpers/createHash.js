const bcrypt = require("bcrypt");

// We want to manually create a password for admin, that is why we can use this file to create a hashed password. Store the hashed password in the database. Never store plain password in database. Later on, we can use bcrypt library to compare the stored hashed password in the database with the password coming from the frontend request which will be hashed and then they are both compared.
const saltRounds = 10;

async function createHash(password) {
  // Remember bcrypt.hash returns a promise with the hashed string so you need to return that Promise,that is why we add return before bcrypt below
  return bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      console.log(hash);
      return hash;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

module.exports = createHash;
