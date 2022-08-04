const articleRouter = require("express").Router();
const { getAllArticles, getArticleById, patchArticleById } = require("../controllers/articles");
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments");

articleRouter.route("/").get(getAllArticles);

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articleRouter;
