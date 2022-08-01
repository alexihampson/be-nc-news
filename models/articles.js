const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = async (id) => {
  const {
    rows: [row],
  } = await db.query("SELECT * FROM articles WHERE article_id=$1;", [id]);

  if (!row) return Promise.reject({ status: 404, msg: "ID not found" });

  return row;
};

exports.updateArticleById = async (id, body) => {
  if (!body.hasOwnProperty("inc_votes"))
    return Promise.reject({ status: 400, msg: "Body incorrectly formatted" });

  const {
    rows: [row],
  } = await db.query("UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *;", [
    body.inc_votes,
    id,
  ]);

  if (!row) return Promise.reject({ status: 404, msg: "ID not found" });

  return row;
};
