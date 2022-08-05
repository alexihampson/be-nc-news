const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = async (id) => {
  const {
    rows: [row],
  } = await db.query(
    `SELECT articles.article_id AS article_id, articles.author AS author, title, articles.body AS body, topic, articles.created_at AS created_at, articles.votes AS votes, COUNT(comment_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id=$1 
    GROUP BY articles.article_id;`,
    [id]
  );

  if (!row) return Promise.reject({ status: 404, msg: "ID not found" });

  row.comment_count = parseInt(row.comment_count);

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

exports.selectAllArticles = async (sort_by, order, topic, limit, p) => {
  let baseRequest = format(
    `SELECT articles.article_id AS article_id, articles.author AS author, title, articles.body AS body, topic, articles.created_at AS created_at, articles.votes AS votes, COUNT(comment_id) AS comment_count 
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`
  );
  let queryRequest = "";
  let limitRequest = format(
    ` GROUP BY articles.article_id
    ORDER BY articles.%s %s 
    LIMIT %s OFFSET %s;`,
    sort_by,
    order.toUpperCase(),
    limit,
    (p - 1) * limit
  );

  if (topic) {
    queryRequest = format(` WHERE topic='%s'`, topic);
  }

  const { rows } = await db.query(baseRequest + queryRequest + limitRequest);

  rows.forEach((row) => (row.comment_count = parseInt(row.comment_count)));

  const {
    rows: [{ total_count }],
  } = await db.query("SELECT COUNT(*) AS total_count FROM articles" + queryRequest + ";");

  if (total_count < (p - 1) * limit) return Promise.reject({ status: 404, msg: "Page Not Found" });

  return [rows, parseInt(total_count)];
};

exports.insertArticle = async (body) => {
  if (!body.title || !body.topic || !body.author || !body.body)
    return Promise.reject({ status: 400, msg: "Body Invalid" });

  const {
    rows: [row],
  } = await db.query(
    `INSERT INTO articles (title, topic, author, body, created_at, votes)
  VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`,
    [body.title, body.topic, body.author, body.body, new Date(Date.now()), 0]
  );

  return row;
};

exports.removeArticleById = async (id) => {
  const {
    rows: [row],
  } = await db.query("DELETE FROM articles WHERE article_id=$1 RETURNING *;", [id]);

  if (!row) return Promise.reject({ status: 404, msg: "ID Not Found" });

  return row;
};
