const db = require("../db/connection");
const format = require("pg-format");

exports.selectAllUsers = async () => {
  const { rows } = await db.query("SELECT * FROM users");

  return rows;
};

exports.selectUserByUsername = async (username) => {
  const {
    rows: [row],
  } = await db.query("Select * FROM users WHERE username=$1;", [username]);

  if (!row) return Promise.reject({ status: 404, msg: "User not found" });

  return row;
};
