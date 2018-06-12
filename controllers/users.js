const { User } = require("../models");

const getUserByName = (req, res, next) => {
  const { username } = req.params;
  User.findOne({ username: username })
    .then(user => {
      if (user === null) {
        return next({
          status: 400,
          message: `User not found! for username : ${username}`
        });
      }
      res.send({ user });
    })
    .catch(next);
};

module.exports = { getUserByName };
