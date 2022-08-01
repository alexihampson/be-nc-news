const { selectArticleById, updateArticleById } = require("../models/articles");

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
