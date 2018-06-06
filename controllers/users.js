const { Topic, Article, User, Comment } = require("../models");

const getUserByName = (req, res, next) => {
  const { username } = req.params;
  User.findOne({ username: username }, (err, user) => {
    res.send({ user });
  });
};

module.exports = { getUserByName };
