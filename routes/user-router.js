const userRouter = require("express").Router();
const { getAllUsers, getUserByUsername, postUser } = require("../controllers/users");

userRouter.route("/").get(getAllUsers).post(postUser);

userRouter.route("/:username").get(getUserByUsername);

module.exports = userRouter;
