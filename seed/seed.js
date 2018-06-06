const mongoose = require("mongoose");
mongoose.Promise = Promise;
const {
  formatArticleData,
  createUserRefObj,
  createArticleRefObj,
  formatCommentData
} = require("../utils");
const { Topic, Article, User, Comment } = require("../models");

const seedDB = ({ data }) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(data.topics),
        User.insertMany(data.users)
      ]);
    })
    .then(([topicDocs, userDocs]) => {
      const userLookup = createUserRefObj(data.users, userDocs);
      return Promise.all([
        Article.insertMany(formatArticleData(data, userLookup)),
        userLookup
      ]);
    })
    .then(([articleDocs, userLookup]) => {
      const articleLookup = createArticleRefObj(data.articles, articleDocs);
      return Comment.insertMany(
        formatCommentData(data, userLookup, articleLookup)
      );
    });
};

module.exports = seedDB;