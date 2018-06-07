const { Topic, Article, User, Comment } = require("../models");

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};

const getArticlesBySlug = (req, res, next) => {
  const { topic_slug } = req.params;
  Article.find({ belongs_to: topic_slug })
    .then(articles => {
      if (articles[0] === undefined)
        return next({
          status: 400,
          message: `Topic not found! for topic : ${topic_slug}`
        });
      res.send({ articles });
    })
    .catch(next);
};

const postArticleByTopic = (req, res, next) => {
  User.findOne({ username: req.body.created_by }).then(user => {
    req.body.created_by = user._id;
    const newArticle = new Article(req.body);
    return newArticle
      .save()
      .then(article => {
        return res.status(201).send({
          article
        });
      })
      .catch(next);
  });
};

module.exports = { getTopics, getArticlesBySlug, postArticleByTopic };
