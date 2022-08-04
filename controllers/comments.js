const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  updateCommentById,
} = require("../models/comments");
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const {
    params: { comment_id },
    body,
  } = req;

  updateCommentById(comment_id, body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
