const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByArticleId = async (id, limit, p) => {
  const { rows } = await db.query(
    "SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id=$1  LIMIT $2 OFFSET $3;",
    [id, limit, (p - 1) * limit]
  );

  const {
    rows: [{ total_count }],
  } = await db.query("SELECT COUNT(*) AS total_count FROM comments WHERE article_id=$1;", [id]);

  if (total_count < (p - 1) * limit) return Promise.reject({ status: 404, msg: "Page Not Found" });

  return [rows, parseInt(total_count)];
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

exports.selectCommentById = async (id) => {
  const {
    rows: [row],
  } = await db.query("SELECT * FROM comments WHERE comment_id=$1;", [id]);

  if (!row) return Promise.reject({ status: 404, msg: "ID Not Found" });

  return row;
};

exports.selectAllComments = async (limit, p, author) => {
  let rows;
  let total_count;

  if (author) {
    rows = (
      await db.query(
        "SELECT comment_id, votes, created_at, author, body FROM comments WHERE author = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;",
        [author, limit, (p - 1) * limit]
      )
    ).rows;

    total_count = (
      await db.query("SELECT COUNT(*) AS total_count FROM comments WHERE author = $1;", [author])
    ).rows[0].total_count;
  } else {
    rows = (
      await db.query(
        "SELECT comment_id, votes, created_at, author, body FROM comments ORDER BY created_at DESC LIMIT $1 OFFSET $2;",
        [limit, (p - 1) * limit]
      )
    ).rows;

    total_count = (await db.query("SELECT COUNT(*) AS total_count FROM comments;")).rows[0]
      .total_count;
  }

  if (total_count < (p - 1) * limit) return Promise.reject({ status: 404, msg: "Page Not Found" });

  return [rows, parseInt(total_count)];
};
