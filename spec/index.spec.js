process.env.NODE_ENV = "test";
const app = require("../app");
const rawData = require("../seed/testData");
const seedDB = require("../seed/seed");
const mongoose = require("mongoose");
const { expect } = require("chai");
const request = require("supertest")(app);

// re-seed test DB before each it block
describe("/northcoders-news", () => {
  let commentDocs;
  let articleDocs;
  let topicDocs;
  let userDocs;
  beforeEach(() => {
    return seedDB(rawData).then(docs => {
      [commentDocs, articleDocs, topicDocs, userDocs] = docs;
    });
  });
  describe("/api", () => {
    describe("/topics", () => {
      it("GET it responds with status 200 and returns an object with all the topics", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(res => {
            expect(res.body.topics[0]).to.contain.all.keys(["title", "slug"]);
          });
      });
      it("GET responds with status 404 for a page not found", () => {
        return request
          .get("/api/alltopics")
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal("page not found");
          });
      });
    });
    describe("/topics/:topic_slug/articles", () => {
      it("GET responds with status 200 and an object with all the articles relating to the topic", () => {
        return request
          .get(`/api/topics/${topicDocs[0].slug}/articles`)
          .expect(200)
          .then(res => {
            expect(res.body.articles[0]).to.contain.all.keys([
              "title",
              "body",
              "belongs_to",
              "votes",
              "created_by",
              "comments"
            ]);
          });
      });
      it("GET responds with status 400 for a page not found when topic is invalid", () => {
        return request
          .get("/api/topics/pasta/articles")
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal(
              "Topic not found! for topic : pasta"
            );
          });
      });
    });
    describe("/articles", () => {
      it.only("GET responds with status 200 and an object containing all the articles", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(res => {
            console.log(res.body);
            expect(res.body.articles[0]).to.contain.keys([
              "title",
              "body",
              "belongs_to",
              "votes",
              "created_by",
              "comments"
            ]);
          });
      });
    });
    describe("/articles/:article_id", () => {
      it("GET responds with status 200 and an object containing the desired article", () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.article).to.contain.keys([
              "title",
              "body",
              "belongs_to",
              "votes",
              "created_by",
              "comments"
            ]);
          });
      });
      it("GET responds with status 400 and a error message", () => {
        return request
          .get(`/api/articles/${userDocs[0]._id}`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              `Article with id ${userDocs[0]._id} not found`
            );
          });
      });
      it("POST responds with status 201 and an object containing the new article", () => {
        const newArticle = {
          title: "new article",
          body: "This is my new article content",
          belongs_to: "cats",
          created_by: "butter_bridge"
        };
        return request
          .post(`/api/topics/cats/articles`)
          .send(newArticle)
          .expect(201)
          .then(res => {
            expect(res.body.article).to.contain.keys([
              "title",
              "body",
              "belongs_to",
              "votes",
              "created_by"
            ]);
          });
      });
      it("PUT responds with status 201 and an object containing the updated article object with a up vote", () => {
        return request
          .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(201)
          .then(res => {
            expect(res.body.article.votes).to.equal(1);
          });
      });
      it("PUT responds with status 201 and an object containg the updated article object with a down vote", () => {
        return request
          .put(`/api/articles/${articleDocs[0]._id}?vote=down`)
          .expect(201)
          .then(res => {
            expect(res.body.article.votes).to.equal(-1);
          });
      });
      it("PUT responds with status 500 and an object containing an error message", () => {
        return request
          .put(`/api/articles/${articleDocs[0]._id}?vote=88`)
          .expect(500)
          .then(res => {
            expect(res.body.message).to.equal("Internal server error!");
          });
      });
    });
    describe("/articles/:article_id/comments", () => {
      it("GET responds with status 200 and an object with all the comments for an article", () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body.comments[0]).to.contain.all.keys([
              "body",
              "belongs_to",
              "created_at",
              "votes",
              "created_by"
            ]);
          });
      });
      it("GET responds with status 404 for a valid ID but not in the database", () => {
        return request
          .get(`/api/articles/${topicDocs[0]._id}/comments`)
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal(
              `Article not found! for ID : ${topicDocs[0]._id}`
            );
          });
      });
      it("POST responds with status 201 and an object containing the new comment", () => {
        const newComment = {
          body: "This is the new comment",
          belongs_to: "Living in the shadow of a great man",
          created_by: "butter_bridge"
        };
        return request
          .post(`/api/articles/${articleDocs[0]._id}/comments`)
          .send(newComment)
          .expect(201)
          .then(res => {
            expect(res.body.comment).to.contain.keys([
              "body",
              "belongs_to",
              "created_at",
              "votes",
              "created_by"
            ]);
          });
      });
      it("POST responds with status 400 and an error message", () => {
        const newComment = {
          body: "This is the new comment",
          belongs_to: "Living in the shadow of a great man",
          created_by: "chattycat"
        };
        return request
          .post(`/api/articles/${articleDocs[0]._id}/comments`)
          .send(newComment)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              `Invalid user input! Problem with created_by or belongs_to fields`
            );
          });
      });
    });
    describe("/comments/:comment_id", () => {
      it("DELETE responds with status 200 and an object with the deleted comment", () => {
        return request
          .delete(`/api/comments/${commentDocs[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.comment).to.contain.all.keys([
              "body",
              "belongs_to",
              "created_at",
              "votes",
              "created_by"
            ]);
          });
      });
      it("DELETE responds with status 404 and a message saying the page was not found when an invalid comment ID is entered", () => {
        return request
          .delete(`/api/comments/${articleDocs[0]._id}`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              `comment with the id ${articleDocs[0]._id} does not exist`
            );
          });
      });
      it("Put responds with status 201 and an object containing the updated comment object with a up vote", () => {
        return request
          .put(`/api/comments/${commentDocs[0]._id}?vote=up`)
          .expect(201)
          .then(res => {
            expect(res.body.comment.votes).to.equal(8);
          });
      });
      it("Put responds with status 201 and an object containing the updated comment object with a down vote", () => {
        return request
          .put(`/api/comments/${commentDocs[0]._id}?vote=down`)
          .expect(201)
          .then(res => {
            expect(res.body.comment.votes).to.equal(6);
          });
      });
      it("Put responds with status 500 and an object containing the the error message", () => {
        return request
          .put(`/api/comments/${commentDocs[0]._id}?vote=wrong`)
          .expect(500)
          .then(res => {
            expect(res.body.message).to.equal("Internal server error!");
          });
      });
    });
    describe("/users/:username", () => {
      it("GET responds with status 200 an an object with the user", () => {
        return request
          .get(`/api/users/${userDocs[0].username}`)
          .expect(200)
          .then(res => {
            expect(res.body.user).to.contain.all.keys([
              "username",
              "name",
              "avatar_url"
            ]);
          });
      });
      it("GET responds with status 400 for a username not in the database", () => {
        return request
          .get(`/api/users/MrBigStuff`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal(
              "User not found! for username : MrBigStuff"
            );
          });
      });
    });
  });
});
after(() => {
  mongoose.disconnect();
});

// disconnect afterwards
