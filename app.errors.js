exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.sqlNotInteger = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.sqlForeignKeyConstraint = (err, req, res, next) => {
  if (err.code === "23503") {
    if (err.table === "articles") {
      res.status(400).send({ msg: "Body Invalid" });
    } else {
      res.status(404).send({ msg: "ID not found" });
    }
  } else {
    next(err);
  }
};

exports.sqlNoColumn = (err, req, res, next) => {
  if (err.code === "42703") {
    res.status(400).send({ msg: "Query Error" });
  } else {
    next(err);
  }
};

exports.sqlBadOrder = (err, req, res, next) => {
  if (err.code === "42601") {
    res.status(400).send({ msg: "Query Error" });
  } else {
    next(err);
  }
};

exports.sqlDuplicateKey = (err, req, res, next) => {
  if (err.code === "23505") {
    res.status(400).send({ msg: "Invalid Key" });
  } else {
    next(err);
  }
};
