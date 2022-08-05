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

exports.insertUser = async (body) => {
  if (!body.username || !body.name || !body.avatar_url)
    return Promise.reject({ status: 400, msg: "Body Invalid" });

  const {
    rows: [row],
  } = await db.query(
    "INSERT INTO users (username, name, avatar_url) VALUES ($1,$2,$3) RETURNING *;",
    [body.username, body.name, body.avatar_url]
  );

  return row;
};

exports.updateUserByUsername = async (username, body) => {
  if (!body.avatar_url) return Promise.reject({ status: 400, msg: "Body Invalid" });

  const {
    rows: [row],
  } = await db.query("UPDATE users SET avatar_url=$1 WHERE username=$2 RETURNING *;", [
    body.avatar_url,
    username,
  ]);

  if (!row) return Promise.reject({ status: 404, msg: "User Not Found" });

  return row;
};

exports.removeUserByUsername = async (username) => {
  const {
    rows: [row],
  } = await db.query("DELETE FROM users WHERE username=$1 RETURNING *;", [username]);

  if (!row) return Promise.reject({ status: 404, msg: "User Not Found" });

  return row;
};
