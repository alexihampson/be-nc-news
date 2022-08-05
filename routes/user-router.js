const userRouter = require("express").Router();
const {
  getAllUsers,
  getUserByUsername,
  postUser,
  patchUserByUsername,
  deleteUserByUsername,
} = require("../controllers/users");

userRouter.route("/").get(getAllUsers).post(postUser);

userRouter
  .route("/:username")
  .get(getUserByUsername)
  .patch(patchUserByUsername)
  .delete(deleteUserByUsername);

module.exports = userRouter;
