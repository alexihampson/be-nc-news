const topicRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics");

topicRouter.route("/").get(getAllTopics);

module.exports = topicRouter;
