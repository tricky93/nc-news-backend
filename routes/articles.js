const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleComments,
  upAndDownVote,
  getArticleById
} = require("../controllers/articles");
const { addAComment } = require("../controllers/comments");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(addAComment);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .put(upAndDownVote);

module.exports = articlesRouter;
