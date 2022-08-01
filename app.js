const express = require("express");
const { getAllTopics } = require("./controllers/topics");
const { getArticleById } = require("./controllers/articles");
const { customErrors, sqlNotInteger } = require("./app.errors");

const app = express();

app.use(express.json());

app.get("/api", (res, req) => {
  res.status(200).send({ msg: "Hello There!" });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use(customErrors);

app.use(sqlNotInteger);

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
