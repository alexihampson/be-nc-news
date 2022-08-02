const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByArticleId = async (id) => {
  const { rows } = await db.query(
    "SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id=$1;",
    [id]
  );

  return rows;
};
