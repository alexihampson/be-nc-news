const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(data));

afterAll(() => {
  if (db.end) db.end();
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
