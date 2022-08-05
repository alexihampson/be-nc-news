const topicRouter = require("express").Router();
const {
  getAllTopics,
  postTopic,
  getTopicBySlug,
  patchTopicBySlug,
  deleteTopicBySlug,
} = require("../controllers/topics");

topicRouter.route("/").get(getAllTopics).post(postTopic);

topicRouter.route("/:slug").get(getTopicBySlug).patch(patchTopicBySlug).delete(deleteTopicBySlug);

module.exports = topicRouter;
