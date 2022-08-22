const express = require("express");
const {
  customErrors,
  sqlNotInteger,
  sqlForeignKeyConstraint,
  sqlNoColumn,
  sqlBadOrder,
  sqlDuplicateKey,
} = require("./app.errors");
const apiRouter = require("./routes/api-router");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

//-----//-----// Error Handlers //-----//-----//

app.use(customErrors);

app.use(sqlNotInteger);

app.use(sqlForeignKeyConstraint);

app.use(sqlNoColumn);

app.use(sqlBadOrder);

app.use(sqlDuplicateKey);

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

//-----// No More Error Handlers //-----//

module.exports = app;
