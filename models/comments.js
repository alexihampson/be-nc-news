const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByArticleId = async (id) => {
  const { rows } = await db.query(
    "SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id=$1;",
    [id]
  );

  return rows;
};

exports.insertCommentByArticleId = async (id, body) => {
  if (!body.hasOwnProperty("username") || !body.hasOwnProperty("body"))
    return Promise.reject({ status: 400, msg: "Body incorrectly formatted" });

  const {
    rows: [row],
  } = await db.query(
    `INSERT INTO comments (body, author, article_id, votes, created_at) VALUES ($1,$2,$3,$4,$5) RETURNING *;`,
    [body.body, body.username, id, 0, new Date(Date.now())]
  );

  return row;
};

exports.removeCommentById = async (id) => {
  const {
    rows: [row],
  } = await db.query("DELETE FROM comments WHERE comment_id=$1 RETURNING *;", [id]);

  if (!row) return Promise.reject({ status: 404, msg: "ID not found" });

  return row;
};

exports.updateCommentById = async (id, body) => {
  if (!body.inc_votes) return Promise.reject({ status: 400, msg: "Body Invalid" });

  const {
    rows: [row],
  } = await db.query("UPDATE comments SET votes=votes+$1 WHERE comment_id=$2 RETURNING *;", [
    body.inc_votes,
    id,
  ]);

  if (!row) return Promise.reject({ status: 404, msg: "ID not found" });

  return row;
};
