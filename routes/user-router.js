const userRouter = require("express").Router();
const { getAllUsers, getUserByUsername } = require("../controllers/users");

userRouter.route("/").get(getAllUsers);

userRouter.route("/:username").get(getUserByUsername);

module.exports = userRouter;
