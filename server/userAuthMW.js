const jwt = require("jsonwebtoken");
const { User } = require("./db/models");

module.exports = function (req, res, next) {
  // get token from cookie
  const { messengerToken } = req.cookies;
  if (messengerToken) {
    jwt.verify(messengerToken, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return next();
      }
      User.findOne({
        where: { id: decoded.id },
      }).then((user) => {
        req.user = user;
        return next();
      });
    });
  } else {
    return next();
  }
};
