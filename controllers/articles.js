const {
  selectArticleById,
  updateArticleById,
  selectAllArticles,
  insertArticle,
  removeArticleById,
} = require("../models/articles");
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
  const limit = query.limit || 10;
  const p = query.p || 1;

  const promises = [selectAllArticles(sort_by, order, query.topic, parseInt(limit), parseInt(p))];

  if (query.topic) promises.push(selectTopicBySlug(query.topic));

  Promise.all(promises)
    .then(([[articles, total_count]]) => {
      res.status(200).send({ total_count, articles });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { body } = req;

  insertArticle(body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
