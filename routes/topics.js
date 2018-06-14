const topicsRouter = require("express").Router();
const {
  getTopics,
  getArticlesByTopic,
  postArticleByTopic
} = require("../controllers/topics");

topicsRouter.route("/").get(getTopics);

topicsRouter
  .route("/:topic_slug/articles")
  .get(getArticlesByTopic)
  .post(postArticleByTopic);

module.exports = topicsRouter;
