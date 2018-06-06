const createUserRefObj = (data, docs) => {
  return data.reduce((acc, datum, index) => {
    acc[datum.username] = docs[index]._id;
    return acc;
  }, {});
};

const createArticleRefObj = (data, docs) => {
  return data.reduce((acc, datum, index) => {
    acc[datum.title] = docs[index]._id;
    return acc;
  }, {});
};

const formatArticleData = (data, userLookup) => {
  return data.articles.map(article => {
    const { title, body, belongs_to, votes, created_by } = article;
    return {
      ...article,
      belongs_to: article.topic,
      created_by: userLookup[article.created_by]
    };
  });
};

const formatCommentData = (data, userLookup, articleLookup) => {
  return data.comments.map(comment => {
    const { body, belongs_to, created_at, votes, created_by } = comment;
    return {
      ...comment,
      belongs_to: articleLookup[comment.belongs_to],
      created_by: userLookup[comment.created_by]
    };
  });
};

module.exports = {
  formatArticleData,
  createUserRefObj,
  createArticleRefObj,
  formatCommentData
};
