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

exports.selectAllArticles = async (sort_by, order, topic) => {
  let dbRequest;

  if (topic) {
    dbRequest = format(
      `SELECT articles.article_id AS article_id, articles.author AS author, title, articles.body AS body, topic, articles.created_at AS created_at, articles.votes AS votes, COUNT(comment_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE topic='%s' 
    GROUP BY articles.article_id
    ORDER BY articles.%s %s;`,
      topic,
      sort_by,
      order.toUpperCase()
    );
  } else {
    dbRequest = format(
      `SELECT articles.article_id AS article_id, articles.author AS author, title, articles.body AS body, topic, articles.created_at AS created_at, articles.votes AS votes, COUNT(comment_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY %s %s;`,
      sort_by,
      order.toUpperCase()
    );
  }

  const { rows } = await db.query(dbRequest);

  rows.forEach((row) => (row.comment_count = parseInt(row.comment_count)));

  return rows;
};
