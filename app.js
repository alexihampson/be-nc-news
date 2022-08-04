const express = require("express");
const {
  customErrors,
  sqlNotInteger,
  sqlForeignKeyConstraint,
  sqlNoColumn,
  sqlBadOrder,
} = require("./app.errors");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

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
