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
        userLookup,
        topicDocs,
        userDocs
      ]);
    })
    .then(([articleDocs, userLookup, topicDocs, userDocs]) => {
      const articleLookup = createArticleRefObj(data.articles, articleDocs);
      return Promise.all([
        Comment.insertMany(formatCommentData(data, userLookup, articleLookup)),
        articleDocs,
        topicDocs,
        userDocs
      ]);
    });
};

module.exports = seedDB;
