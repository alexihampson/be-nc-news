const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const { convertTimestampToDate } = require("../db/seeds/utils");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));

afterAll(() => {
  db.end();
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("200: Returns list of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toEqual(data.topicData);
        });
    });
  });

  describe("POST", () => {
    test("201: Returns new topic when provided one", () => {
      const test = { slug: "test", description: "This is a test", banana: "banana" };
      return request(app)
        .post("/api/topics")
        .send(test)
        .expect(201)
        .then((res) => {
          expect(res.body.topic.slug).toBe(test.slug);
          expect(res.body.topic.description).toBe(test.description);
        });
    });

    test("400: Returns correct error when missing key", () => {
      const test = { slug: "test", banana: "banana" };
      return request(app)
        .post("/api/topics")
        .send(test)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Body Invalid");
        });
    });

    test("400: Returns correct error when body contains slug that already exists", () => {
      const test = { slug: "cats", description: "The best animal" };
      return request(app)
        .post("/api/topics")
        .send(test)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Key");
        });
    });
  });
});

describe("/api/article/:article_id", () => {
  describe("GET", () => {
    test("200: Returns requested article", () => {
      const output = convertTimestampToDate({ ...data.articleData[2], article_id: 3 });
      output.created_at = output.created_at.toJSON();
      output.comment_count = 2;
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual(output);
        });
    });

    test("404: Returns correct error message", () => {
      return request(app)
        .get("/api/articles/20000000")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID not found");
        });
    });

    test("400: Returns correct error message", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });

  describe("PATCH", () => {
    test("200: Returns the updated file", () => {
      const output = convertTimestampToDate({ ...data.articleData[2], article_id: 3 });
      output.created_at = output.created_at.toJSON();
      output.votes -= 10;
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: -10 })
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual(output);
        });
    });

    test("404: Returns correct error message", () => {
      return request(app)
        .patch("/api/articles/20000000")
        .send({ inc_votes: -10, banana: "banana" })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID not found");
        });
    });

    test("400: Returns correct error message for wrong path", () => {
      return request(app)
        .patch("/api/articles/banana")
        .send({ inc_votes: -10 })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });

    test("400: Returns correct error message for wrong body", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ banana: "banana" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Body incorrectly formatted");
        });
    });
  });

  describe("DELETE", () => {
    test("200: Returns 204 no content when successfull", () => {
      return request(app).delete("/api/articles/2").expect(204);
    });

    test("404: Returns correct error when ID out of range", () => {
      return request(app)
        .delete("/api/articles/30000000")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID Not Found");
        });
    });

    test("400: Returns correct error when ID of invalid type", () => {
      return request(app)
        .delete("/api/articles/banana")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("200: Returns list of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          expect(res.body.users).toEqual(data.userData);
        });
    });
  });

  describe("POST", () => {
    test("201: Returns the added user", () => {
      const test = { username: "Test", name: "Test", avatar_url: "Test" };
      return request(app)
        .post("/api/users")
        .send(test)
        .expect(201)
        .then((res) => {
          expect(res.body.user).toEqual(test);
        });
    });

    test("400: Returns correct error when body missing key", () => {
      const test = { username: "Test", name: "Test" };
      return request(app)
        .post("/api/users")
        .send(test)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Body Invalid");
        });
    });

    test("400: Returns correct error when username already taken", () => {
      const test = { username: "lurker", name: "Test", avatar_url: "Test" };
      return request(app)
        .post("/api/users")
        .send(test)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Key");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("200: Returns list of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).toBe(10);
          expect(res.body.articles).toBeSortedBy("created_at", { descending: true });
          res.body.articles.forEach((article) => {
            expect(article.author).toEqual(expect.any(String));
            expect(article.title).toEqual(expect.any(String));
            expect(article.article_id).toEqual(expect.any(Number));
            expect(article.topic).toEqual(expect.any(String));
            expect(article.created_at).toEqual(expect.any(String));
            expect(article.votes).toEqual(expect.any(Number));
            expect(article.comment_count).toEqual(expect.any(Number));
          });
          expect(res.body.total_count).toBe(data.articleData.length);
        });
    });

    test("200: Returns list of articles sorted by given column name", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("title", { descending: true });
        });
    });

    test("200: Returns list of articles sorted by given order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("created_at");
        });
    });

    test("200: Returns list of articles filtered by a given topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).toBe(1);
          res.body.articles.forEach((article) => {
            expect(article.topic).toBe("cats");
          });
        });
    });

    test("200: Returns list of articles after processing multiple queries", () => {
      return request(app)
        .get("/api/articles?topic=mitch&order=asc&sort_by=article_id&limit=100")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("article_id");
          expect(res.body.articles.length).toBe(data.articleData.length - 1);
        });
    });

    test("200: Returns empty list of articles if given topic exists but has no articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).toBe(0);
        });
    });

    test("200: Returns list restricted by the limit query", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .expect(200)
        .then((res) => {
          expect(res.body.total_count).toBe(data.articleData.length);
          expect(res.body.articles.length).toBe(5);
        });
    });

    test("200: Returns list restricted by the page query", () => {
      return request(app)
        .get("/api/articles?p=2")
        .expect(200)
        .then((res) => {
          expect(res.body.total_count).toBe(data.articleData.length);
          expect(res.body.articles.length).toBeLessThanOrEqual(10);
        });
    });

    test("400: Returns error if sort_by column doesn't exist", () => {
      return request(app)
        .get("/api/articles?sort_by=banana")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Query Error");
        });
    });

    test("400: Returns error if order is not asc or desc", () => {
      return request(app)
        .get("/api/articles?order=banana")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Query Error");
        });
    });

    test("404: Returns error if topic doesn't exist", () => {
      return request(app)
        .get("/api/articles?topic=banana")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Topic Not Found");
        });
    });

    test("400: Returns error if limit is not a number", () => {
      return request(app)
        .get("/api/articles?limit=banana")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Query Error");
        });
    });

    test("400: Returns error if page is not a number", () => {
      return request(app)
        .get("/api/articles?p=banana")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Query Error");
        });
    });

    test("404: Returns error if page is beyond the extent of the data", () => {
      return request(app)
        .get("/api/articles?p=1000")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Page Not Found");
        });
    });
  });

  describe("POST", () => {
    test("201: Returns added article", () => {
      const test = {
        author: "lurker",
        title: "Test Article",
        body: "This is a test",
        topic: "cats",
        banana: "banana",
      };
      return request(app)
        .post("/api/articles")
        .send(test)
        .expect(201)
        .then((res) => {
          expect(res.body.article.article_id).toEqual(expect.any(Number));
          expect(res.body.article.votes).toEqual(expect.any(Number));
          expect(res.body.article.created_at).toEqual(expect.any(String));
          expect(res.body.article.author).toBe(test.author);
          expect(res.body.article.body).toBe(test.body);
          expect(res.body.article.title).toBe(test.title);
          expect(res.body.article.topic).toBe(test.topic);
        });
    });

    test("400: Returns error if body doesn't contain all required info", () => {
      test = { title: "Test", banana: "banana" };
      return request(app)
        .post("/api/articles")
        .send(test)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Body Invalid");
        });
    });

    test("400: Returns error if author isn't in users table", () => {
      test = { title: "Test", author: "banana", body: "This is a test", topic: "cats" };
      return request(app)
        .post("/api/articles")
        .send(test)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Body Invalid");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("200: Returns list of comments for an article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments.length).toBe(10);
          expect(res.body.total_count).toBe(11);
          res.body.comments.forEach((comment) => {
            expect(comment.comment_id).toEqual(expect.any(Number));
            expect(comment.votes).toEqual(expect.any(Number));
            expect(comment.created_at).toEqual(expect.any(String));
            expect(comment.author).toEqual(expect.any(String));
            expect(comment.body).toEqual(expect.any(String));
          });
        });
    });

    test("200: Returns empty list of comments for an article with no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments.length).toBe(0);
        });
    });

    test("200: Returns list of comments for an article length limited by a query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then((res) => {
          expect(res.body.comments.length).toBe(5);
          expect(res.body.total_count).toBe(11);
          res.body.comments.forEach((comment) => {
            expect(comment.comment_id).toEqual(expect.any(Number));
            expect(comment.votes).toEqual(expect.any(Number));
            expect(comment.created_at).toEqual(expect.any(String));
            expect(comment.author).toEqual(expect.any(String));
            expect(comment.body).toEqual(expect.any(String));
          });
        });
    });

    test("200: Returns list of comments for an article with multiple pages", () => {
      return request(app)
        .get("/api/articles/1/comments?p=2")
        .expect(200)
        .then((res) => {
          expect(res.body.comments.length).toBe(1);
          expect(res.body.total_count).toBe(11);
          res.body.comments.forEach((comment) => {
            expect(comment.comment_id).toEqual(expect.any(Number));
            expect(comment.votes).toEqual(expect.any(Number));
            expect(comment.created_at).toEqual(expect.any(String));
            expect(comment.author).toEqual(expect.any(String));
            expect(comment.body).toEqual(expect.any(String));
          });
        });
    });

    test("404: Returns correct error message", () => {
      return request(app)
        .get("/api/articles/20000000/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID not found");
        });
    });

    test("400: Returns correct error message", () => {
      return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });

    test("400: Returns correct error when given incorrect limit value", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=banana")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });

    test("400: Returns correct error when given incorrect page value", () => {
      return request(app)
        .get("/api/articles/1/comments?p=banana")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });

    test("404: Returns correct error when page value out of range", () => {
      return request(app)
        .get("/api/articles/1/comments?p=300")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Page Not Found");
        });
    });
  });

  describe("POST", () => {
    test("201: Returns posted comment", () => {
      const test = { username: "lurker", body: "Nice Article!" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(test)
        .expect(201)
        .then((res) => {
          expect(res.body.comment.comment_id).toEqual(expect.any(Number));
          expect(res.body.comment.votes).toEqual(expect.any(Number));
          expect(res.body.comment.created_at).toEqual(expect.any(String));
          expect(res.body.comment.author).toBe(test.username);
          expect(res.body.comment.body).toBe(test.body);
          expect(res.body.comment.article_id).toBe(1);
        });
    });

    test("201: Returns posted comment ignoring other keys", () => {
      const test = { username: "lurker", body: "Nice Article!", banana: "banana" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(test)
        .expect(201)
        .then((res) => {
          expect(res.body.comment.comment_id).toEqual(expect.any(Number));
          expect(res.body.comment.votes).toEqual(expect.any(Number));
          expect(res.body.comment.created_at).toEqual(expect.any(String));
          expect(res.body.comment.author).toBe(test.username);
          expect(res.body.comment.body).toBe(test.body);
          expect(res.body.comment.article_id).toBe(1);
        });
    });

    test("404: Returns correct error message", () => {
      const test = { username: "lurker", body: "Nice Article!" };
      return request(app)
        .post("/api/articles/20000000/comments")
        .send(test)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID not found");
        });
    });

    test("400: Returns correct error message", () => {
      const test = { username: "lurker", body: "Nice Article!" };
      return request(app)
        .post("/api/articles/banana/comments")
        .send(test)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });

    test("400: Returns correct error message for wrong body", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ banana: "banana" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Body incorrectly formatted");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("204: Returns no content if the delete complete", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });

    test("404: Returns error if comment id not in the db", () => {
      return request(app)
        .delete("/api/comments/1000000")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID not found");
        });
    });

    test("400: Returns error if comment id not in the db", () => {
      return request(app)
        .delete("/api/comments/banana")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });

  describe("PATCH", () => {
    test("200: Returns updated comment", () => {
      const test = { inc_votes: -10, banana: "banana" };
      return request(app)
        .patch("/api/comments/3")
        .send(test)
        .expect(200)
        .then((res) => {
          expect(res.body.comment.votes).toBe(90);
        });
    });

    test("404: Returns error if comment id doesn't exist", () => {
      const test = { inc_votes: -10, banana: "banana" };
      return request(app)
        .patch("/api/comments/3000000")
        .send(test)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID not found");
        });
    });

    test("400: Returns error if comment id is invalid", () => {
      const test = { inc_votes: -10, banana: "banana" };
      return request(app)
        .patch("/api/comments/banana")
        .send(test)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });

    test("400: Returns error if body is invalid", () => {
      const test = { banana: "banana" };
      return request(app)
        .patch("/api/comments/3")
        .send(test)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Body Invalid");
        });
    });
  });

  describe("GET", () => {
    test("200: Returns requested comment", () => {
      return request(app)
        .get("/api/comments/2")
        .expect(200)
        .then((res) => {
          expect(res.body.comment.comment_id).toBe(2);
          expect(res.body.comment.votes).toEqual(expect.any(Number));
          expect(res.body.comment.created_at).toEqual(expect.any(String));
          expect(res.body.comment.author).toEqual(expect.any(String));
          expect(res.body.comment.body).toEqual(expect.any(String));
          expect(res.body.comment.article_id).toEqual(expect.any(Number));
        });
    });

    test("404: Returns error if comment Id out of range", () => {
      return request(app)
        .get("/api/comments/200000")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID Not Found");
        });
    });

    test("400: Returns error if comment Id invalid type", () => {
      return request(app)
        .get("/api/comments/banana")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("/api", () => {
  describe("GET", () => {
    test("200: Returns data from endpoints.json", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          expect(res.body.endpoints).toEqual(endpoints);
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("200: returns valid user info", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then((res) => {
          expect(res.body.user).toEqual({
            username: "lurker",
            name: "do_nothing",
            avatar_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          });
        });
    });

    test("404: returns user not found if incorrect username", () => {
      return request(app)
        .get("/api/users/idontexist")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("User not found");
        });
    });
  });

  describe("PATCH", () => {
    test("200: returns valid updated user", () => {
      const test = { avatar_url: "test", banana: "banana" };
      return request(app)
        .patch("/api/users/lurker")
        .send(test)
        .expect(200)
        .then((res) => {
          expect(res.body.user).toEqual({
            username: "lurker",
            name: "do_nothing",
            avatar_url: "test",
          });
        });
    });

    test("404: returns user Not Found if incorrect username", () => {
      const test = { avatar_url: "test" };
      return request(app)
        .patch("/api/users/idontexist")
        .send(test)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("User Not Found");
        });
    });

    test("400: returns error is body invalid", () => {
      const test = { banana: "banana" };
      return request(app)
        .patch("/api/users/lurker")
        .send(test)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Body Invalid");
        });
    });
  });

  describe("DELETE", () => {
    test("204: Returns no content if the delete completes", () => {
      return request(app).delete("/api/users/lurker").expect(204);
    });

    test("404: Returns error if user id not in the db", () => {
      return request(app)
        .delete("/api/users/imnotreal")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("User Not Found");
        });
    });
  });
});

describe("/api/topics/:slug", () => {
  describe("GET", () => {
    test("200: returns valid topic info", () => {
      return request(app)
        .get("/api/topics/cats")
        .expect(200)
        .then((res) => {
          expect(res.body.topic).toEqual({
            slug: "cats",
            description: "Not dogs",
          });
        });
    });

    test("404: returns Topic Not Found if incorrect slug", () => {
      return request(app)
        .get("/api/topics/idontexist")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Topic Not Found");
        });
    });
  });

  describe("PATCH", () => {
    test("200: returns valid updated topic", () => {
      const test = { description: "Very Cute!", banana: "banana" };
      return request(app)
        .patch("/api/topics/cats")
        .send(test)
        .expect(200)
        .then((res) => {
          expect(res.body.topic).toEqual({
            slug: "cats",
            description: "Very Cute!",
          });
        });
    });

    test("404: returns Topic Not Found if incorrect slug", () => {
      const test = { description: "Very Cute!" };
      return request(app)
        .patch("/api/topics/idontexist")
        .send(test)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Topic Not Found");
        });
    });

    test("400: returns Topic Not Found if incorrect slug", () => {
      const test = { banana: "banana" };
      return request(app)
        .patch("/api/topics/cats")
        .send(test)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Body Invalid");
        });
    });
  });

  describe("DELETE", () => {
    test("200: Returns 204 no content when successfull", () => {
      return request(app).delete("/api/topics/paper").expect(204);
    });

    test("404: Returns correct error when slug doesn't exist", () => {
      return request(app)
        .delete("/api/topics/banana")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Topic Not Found");
        });
    });
  });
});
