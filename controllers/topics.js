const { Topic, Article, User, Comment } = require("../models");

const getTopics = (req, res, next) => {
  console.log("hi");
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};

module.exports = { getTopics };
