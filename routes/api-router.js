const apiRouter = require("express").Router();
const endpoints = require("../endpoints.json");
const topicRouter = require("./topic-router");
const articleRouter = require("./article-router");
const userRouter = require("./user-router");
const commentRouter = require("./comment-router");

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints });
});

apiRouter.use("/topics", topicRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
