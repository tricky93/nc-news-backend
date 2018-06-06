const { Topic, Article, User, Comment } = require("../models");

const getTopics = (req, res, next) => {
  Topic.find().then(topics => {
    console.log(topics);
    res.send({ topics });
  });
};

module.exports = { getTopics };
