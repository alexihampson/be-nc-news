const topicRouter = require("express").Router();
const { getAllTopics, postTopic, getTopicBySlug } = require("../controllers/topics");

topicRouter.route("/").get(getAllTopics).post(postTopic);

topicRouter.route("/:slug").get(getTopicBySlug);

module.exports = topicRouter;
