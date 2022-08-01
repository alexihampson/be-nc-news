const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = async (id) => {
  const {
    rows: [row],
  } = await db.query("SELECT * FROM articles WHERE article_id=$1;", [id]);

  if (!row) return Promise.reject({ status: 404, msg: "ID not found" });

  return row;
};
