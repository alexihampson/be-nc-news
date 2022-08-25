const commentRouter = require("express").Router();
const {
  deleteCommentById,
  patchCommentById,
  getCommentById,
  getAllComments,
} = require("../controllers/comments");

commentRouter.route("/").get(getAllComments);

commentRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentById)
  .get(getCommentById);

module.exports = commentRouter;
