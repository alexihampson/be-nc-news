const { selectAllUsers, selectUserByUsername, insertUser } = require("../models/users");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const { body } = req;

  insertUser(body)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};
