const { Topic, Article, User, Comment } = require("../models");

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  Comment.find()
    .lean()
    .then(comments => {
      const commentObj = comments.reduce((acc, element) => {
        if (acc[element.belongs_to] !== undefined) {
          acc[element.belongs_to]++;
        } else {
          acc[element.belongs_to] = 1;
        }
        return acc;
      }, {});
      return Promise.all([
        commentObj,
        Article.find({ belongs_to: topic_slug }).lean()
      ]);
    })
    .then(([commentObj, articles]) => {
      if (articles[0] === undefined)
        return next({
          status: 404,
          message: `Topic not found! for topic : ${topic_slug}`
        });
      articles = articles.map(article => {
        return {
          ...article,
          comments: commentObj[article._id]
        };
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
        res.status(201).send({
          article
        });
      })
      .catch(next);
  });
};

module.exports = { getTopics, getArticlesByTopic, postArticleByTopic };
