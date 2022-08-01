const express = require("express");
const { getAllTopics } = require("./controllers/topics");

const app = express();

app.use(express.json());

app.get("/api", (res, req) => {
  res.status(200).send({ msg: "Hello There!" });
});

app.get("/api/topics", getAllTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
