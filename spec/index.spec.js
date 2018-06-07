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
      it("GET it reponds with status 200 and returns an object with all the topics", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(res => {
            expect(res.body.topics[0]).to.contain.all.keys(["title", "slug"]);
          });
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
      it.only("GET responds with status 400 for a username not in the database", () => {
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
  after(() => {
    mongoose.disconnect();
  });
});
// disconnect afterwards
