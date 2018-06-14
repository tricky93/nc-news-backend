const { Article, Comment, User } = require("../models");

const getArticles = (req, res, next) => {
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
      return Promise.all([commentObj, Article.find().lean()]);
    })
    .then(([commentObj, articles]) => {
      articles = articles.map(article => {
        return {
          ...article,
          comments: commentObj[article._id]
        };
      });
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
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
        Article.findOne({ _id: article_id }).lean()
      ]);
    })
    .then(([commentObj, article]) => {
      if (article === null)
        return next({
          status: 400,
          message: `Article with id ${article_id} not found`
        });
      article.comments = commentObj[article._id];
      res.status(200).send({ article });
    })
    .catch(next);
};

const getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([Comment.find({ belongs_to: article_id }), User.find()])
    .then(([comments, users]) => {
      if (comments[0] === undefined)
        return next({
          status: 404,
          message: `Article not found! for ID : ${article_id}`
        });
      const userObj = users.reduce((acc, user) => {
        if (acc[user._id] === undefined) acc[user._id] = user.username;
        return acc;
      }, {});
      comments = comments.map(comment => {
        return {
          created_at: comment.created_at,
          votes: comment.votes,
          _id: comment._id,
          body: comment.body,
          belongs_to: comment.belongs_to,
          created_by: userObj[comment.created_by]
        };
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
  let voter;
  vote === "up" ? (voter = 1) : (voter = -1);

  Article.findByIdAndUpdate(
    article_id,
    { $inc: { votes: voter } },
    { new: true }
  )
    .then(article => {
      res.status(201).send({ article });
    })
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};

module.exports = {
  getArticles,
  getArticleComments,
  upAndDownVote,
  getArticleById
};
