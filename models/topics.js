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

  if (!row) return Promise.reject({ status: 404, msg: "Topic not found" });

  return row;
};
