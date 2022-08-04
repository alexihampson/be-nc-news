const topicRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics");

topicRouter.get("/", getAllTopics);

module.exports = topicRouter;
