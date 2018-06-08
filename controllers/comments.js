const { Topic, Article, User, Comment } = require("../models");

const addAComment = (req, res, next) => {
  const { article_id } = req.params;
  const username = req.body.created_by;
  Promise.all([
    Article.findById(article_id),
    User.findOne({ username: username })
  ])
    .then(([article, user]) => {
      if (user === null || article === null) {
        return next({
          status: 400,
          message: `Invalid user input! Problem with created_by or belongs_to fields`
        });
      }
      const newComment = new Comment(req.body);
      newComment.belongs_to = article._id;
      newComment.created_by = user._id;
      return newComment.save().then(comment => {
        return res.status(201).send({ comment });
      });
    })
    .catch(next);
};

const removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove(comment_id);
  if (comment === null)
    return next({
      status: 400,
      message: "comment does not exist"
    })
      .then(comment => {
        res.send({ comment });
      })
      .catch(next);
};

const upAndDownCommentVote = (req, res, next) => {
  const { comment_id } = req.params;
  const { vote } = req.query;
  if (vote !== "up" && vote !== "down")
    return next({
      status: 500,
      message: `Internal server error!`
    });
  vote === "up"
    ? Comment.findByIdAndUpdate(
        comment_id,
        { $inc: { votes: 1 } },
        { new: true }
      ).then(comment => {
        res.status(201).send({ comment });
      })
    : Comment.findByIdAndUpdate(
        comment_id,
        { $inc: { votes: -1 } },
        { new: true }
      )
        .then(comment => {
          res.status(201).send({ comment });
        })
        .catch(next);
};

module.exports = { addAComment, removeComment, upAndDownCommentVote };
