const { selectArticleById, updateArticleById, selectAllArticles } = require("../models/articles");
const { selectTopicBySlug } = require("../models/topics");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const {
    params: { article_id },
    body,
  } = req;

  updateArticleById(article_id, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { query } = req;

  const sort_by = query.sort_by || "created_at";
  const order = query.order || "desc";

  const promises = [selectAllArticles(sort_by, order, query.topic)];

  if (query.topic) promises.push(selectTopicBySlug(query.topic));

  Promise.all(promises)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
