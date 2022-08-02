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
    res.status(404).send({ msg: "ID not found" });
  } else {
    next(err);
  }
};

exports.sqlNoColumn = (err, req, res, next) => {
  if (err.code === "42703") {
    res.status(400).send({ msg: "Incorrect column name" });
  } else {
    next(err);
  }
};

exports.sqlBadOrder = (err, req, res, next) => {
  if (err.code === "42601") {
    res.status(400).send({ msg: "Incorrect order format" });
  } else {
    next(err);
  }
};
