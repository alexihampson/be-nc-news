const topicRouter = require("express").Router();
const { getAllTopics, postTopic } = require("../controllers/topics");

topicRouter.route("/").get(getAllTopics).post(postTopic);

module.exports = topicRouter;
