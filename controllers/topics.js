const { selectAllTopics, insertTopic, selectTopicBySlug } = require("../models/topics");

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

exports.getTopicBySlug = (req, res, next) => {
  const { slug } = req.params;

  selectTopicBySlug(slug)
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch(next);
};
