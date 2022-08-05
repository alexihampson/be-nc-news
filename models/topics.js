const db = require("../db/connection");
const format = require("pg-format");

exports.selectAllTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics;");

  return rows;
};

exports.selectTopicBySlug = async (slug) => {
  const {
    rows: [row],
  } = await db.query("SELECT * FROM topics WHERE slug=$1;", [slug]);

  if (!row) return Promise.reject({ status: 404, msg: "Topic Not Found" });

  return row;
};

exports.insertTopic = async (body) => {
  if (!body.slug || !body.description) return Promise.reject({ status: 400, msg: "Body Invalid" });

  const {
    rows: [row],
  } = await db.query("INSERT INTO topics (slug, description) VALUES ($1,$2) RETURNING *;", [
    body.slug,
    body.description,
  ]);

  return row;
};

exports.updateTopicBySlug = async (slug, body) => {
  if (!body.description) return Promise.reject({ status: 400, msg: "Body Invalid" });

  const {
    rows: [row],
  } = await db.query("UPDATE topics SET description=$1 WHERE slug=$2 RETURNING *;", [
    body.description,
    slug,
  ]);

  if (!row) return Promise.reject({ status: 404, msg: "Topic Not Found" });

  return row;
};
