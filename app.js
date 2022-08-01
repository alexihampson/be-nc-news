const express = require("express");
const {} = require("./controllers/topics");

const app = express();

app.use(express.json());

app.get("/api", (res, req) => {
  res.status(200).send({ msg: "Hello There!" });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
