const { selectCommentsByArticleId, insertCommentByArticleId } = require("../models/comments");
const { selectArticleById } = require("../models/articles");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([selectCommentsByArticleId(article_id), selectArticleById(article_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const {
    params: { article_id },
    body,
  } = req;

  insertCommentByArticleId(article_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
