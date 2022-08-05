const articleRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  patchArticleById,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles");
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments");

articleRouter.route("/").get(getAllArticles).post(postArticle);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articleRouter;
