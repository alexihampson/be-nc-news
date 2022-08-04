const articleRouter = require("express").Router();
const { getAllArticles, getArticleById, patchArticleById } = require("../controllers/articles");
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments");

articleRouter.get("/", getAllArticles);

articleRouter.get("/:article_id", getArticleById);
articleRouter.patch("/:article_id", patchArticleById);

articleRouter.get("/:article_id/comments", getCommentsByArticleId);
articleRouter.post("/:article_id/comments", postCommentByArticleId);

module.exports = articleRouter;
