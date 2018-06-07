const { Topic, Article, User, Comment } = require("../models");
const { formatCommentData } = require("../models");

const getArticles = (req, res, next) => {
  Comment.find().then(comments => {
    const commentObj = comments.reduce((acc, element, index) => {
      if (acc[element.belongs_to] === 1) {
        acc[element.belongs_to]++;
      } else {
        acc[element.belongs_to] = 1;
      }
      return acc;
    }, {});
    Promise.all([commentObj, Article.find()])
      .then(([commentObj, articles]) => {
       FIXME: these are spitting out promises !
        return articles.map(article => {
          let { _id } = article;
          return {
            ...article,
            comments: commentObj[article._id]
          };
        });
      })
      .then(console.log);
  });
};

module.exports = { getArticles };
