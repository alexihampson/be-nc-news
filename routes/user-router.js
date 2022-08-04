const userRouter = require("express").Router();
const { getAllUsers } = require("../controllers/users");

userRouter.route("/").get(getAllUsers);

module.exports = userRouter;
