const commentsRouter = require("express").Router();
const {
  removeComment,
  upAndDownCommentVote
} = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .delete(removeComment)
  .put(upAndDownCommentVote);

module.exports = commentsRouter;
