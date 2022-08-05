const userRouter = require("express").Router();
const {
  getAllUsers,
  getUserByUsername,
  postUser,
  patchUserByUsername,
} = require("../controllers/users");

userRouter.route("/").get(getAllUsers).post(postUser);

userRouter.route("/:username").get(getUserByUsername).patch(patchUserByUsername);

module.exports = userRouter;
