const { Topic, Article, User, Comment } = require("../models");

const getArticles = (req, res, next) => {
  Comment.find()
    .lean()
    .then(comments => {
      const commentObj = comments.reduce((acc, element, index) => {
        if (acc[element.belongs_to] !== undefined) {
          acc[element.belongs_to]++;
        } else {
          acc[element.belongs_to] = 1;
        }
        return acc;
      }, {});
      return Promise.all([commentObj, Article.find().lean()]);
    })
    .then(([commentObj, articles]) => {
      articles = articles.map(article => {
        let { _id } = article;
        return {
          ...article,
          comments: commentObj[article._id]
        };
      });
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  Comment.find({ belongs_to: article_id })
    .then(comments => {
      if (comments[0] === undefined)
        return next({
          status: 404,
          message: `Article not found! for ID : ${article_id}`
        });
      res.send({ comments });
    })
    .catch(next);
};

const upAndDownVote = (req, res, next) => {
  const { article_id } = req.params;
  const { vote } = req.query;
  if (vote !== "up" && vote !== "down")
    return next({
      status: 500,
      message: `Internal server error!`
    });
  vote === "up"
    ? Article.findByIdAndUpdate(
        article_id,
        { $inc: { votes: 1 } },
        { new: true }
      ).then(article => {
        res.status(201).send({ article });
      })
    : Article.findByIdAndUpdate(
        article_id,
        { $inc: { votes: -1 } },
        { new: true }
      )
        .then(article => {
          res.status(201).send({ article });
        })
        .catch(next);
};

module.exports = { getArticles, getArticleComments, upAndDownVote };
