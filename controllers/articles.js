const { Topic, Article, User, Comment } = require("../models");

const getArticles = (req, res, next) => {
  return Comment.find().then(comments => {
    const commentIdAndArticle = comments.map(comment => {
      return { commentId: comment._id, articleId: comment.belongs_to };
    });
  });
};

module.exports = { getArticles };
