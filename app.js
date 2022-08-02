const express = require("express");
const { getAllTopics } = require("./controllers/topics");
const { getArticleById, patchArticleById, getAllArticles } = require("./controllers/articles");
const {
  customErrors,
  sqlNotInteger,
  sqlForeignKeyConstraint,
  sqlNoColumn,
  sqlBadOrder,
} = require("./app.errors");
const { getAllUsers } = require("./controllers/users");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments");

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "Hello There!" });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/users", getAllUsers);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use(customErrors);

app.use(sqlNotInteger);

app.use(sqlForeignKeyConstraint);

app.use(sqlNoColumn);

app.use(sqlBadOrder);

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
