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
  Promise.all([
    Comment.find(),
    User.find(),
    Article.find({ belongs_to: topic_slug }).lean()
  ])
    .then(([comments, users, articles]) => {
      if (articles[0] === undefined)
        return next({
          status: 404,
          message: `Topic not found! for topic : ${topic_slug}`
        });
      const commentObj = comments.reduce((acc, element) => {
        if (acc[element.belongs_to] !== undefined) {
          acc[element.belongs_to]++;
        } else {
          acc[element.belongs_to] = 1;
        }
        return acc;
      }, {});
      const userObj = users.reduce((acc, user) => {
        if (acc[user._id] === undefined) {
          acc[user._id] = user.username;
          return acc;
        }
      }, {});
      articles = articles.map(article => {
        return {
          ...article,
          comments: commentObj[article._id],
          created_by: userObj[article.created_by]
        };
      });
      res.status(200).send({ articles });
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
