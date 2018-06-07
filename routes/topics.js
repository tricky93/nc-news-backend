const topicsRouter = require("express").Router();
const {
  getTopics,
  getArticlesBySlug,
  postArticleByTopic
} = require("../controllers/topics");

topicsRouter.route("/").get(getTopics);

topicsRouter
  .route("/:topic_slug/articles")
  .get(getArticlesBySlug)
  .post(postArticleByTopic);

module.exports = topicsRouter;
