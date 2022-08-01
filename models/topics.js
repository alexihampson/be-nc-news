const db = require("../db/connection");
const format = require("pg-format");

exports.selectAllTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics;");

  return rows;
};
