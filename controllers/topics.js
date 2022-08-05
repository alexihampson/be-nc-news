const { selectAllTopics, insertTopic } = require("../models/topics");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { body } = req;

  insertTopic(body)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
