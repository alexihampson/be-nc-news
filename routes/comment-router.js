const commentRouter = require("express").Router();
const { deleteCommentById, patchCommentById, getCommentById } = require("../controllers/comments");

commentRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentById)
  .get(getCommentById);

module.exports = commentRouter;
