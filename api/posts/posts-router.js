// post routerları buraya yazın
const express = require("express");
const router = express.Router();
const posts = require("./posts-model");

router.get("/", async (req, res) => {
  const postsList = await posts.find();
  res.status(200).json(postsList);
});

module.exports = router;
