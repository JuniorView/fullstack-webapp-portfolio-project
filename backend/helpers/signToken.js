var jwt = require("jsonwebtoken");

function signToken(payload) {
  // h stands for hour,e.g: 1h stands for 1 hour, m stands for minutes. and the Date for exp is UTC timezone
  const token = jwt.sign(payload, process.env.secret, {
    expiresIn: "1h",
  });

  return token;
}

module.exports = signToken;
