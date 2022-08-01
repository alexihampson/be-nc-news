const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const { convertTimestampToDate } = require("../db/seeds/utils");

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
});

describe("/api/article/:article_id", () => {
  describe("GET", () => {
    test("200: Returns requested article", () => {
      const output = convertTimestampToDate({ ...data.articleData[2], article_id: 3 });
      output.created_at = output.created_at.toJSON();
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
});
